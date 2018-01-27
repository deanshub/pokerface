import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

const NAV_NEXT = 'next'
const NAV_PREVIOUS = 'previous'

export default class Slider extends Component {
  static defaultProps = {
    displayItemIndex: 0,
    autoplay:false,
    displayItemsDuration:[],
    permanentItems:[],
    defaultDisplayDuration: 3000
  }

  constructor(props){
    super(props)
    const {autoplay, displayItemIndex} = props
    this.state = {autoplay, displayItemIndex}
  }

  componentDidMount(){
    const {autoplay, children} = this.props

    if (autoplay && children.length > 1){
      this.setAutoplayTimeout()
    }
  }

  componentWillUnmount(){
    clearTimeout(this.timeout)
  }

  setAutoplayTimeout(){
    const {displayItemIndex} = this.state

    const timeoutCallback = () => {
      const nextDisplayItem = this.nextIndex()

      this.setState({displayItemIndex:nextDisplayItem})
      this.timeout = setTimeout(timeoutCallback, this.displayItemTime(nextDisplayItem))
    }

    this.timeout = setTimeout(timeoutCallback, this.displayItemTime(displayItemIndex))
  }

  updateItem(newIndex, lastAction){
    const {autoplay} = this.props

    if (autoplay){
      clearTimeout(this.timeout)
      this.setAutoplayTimeout()
    }

    this.setState({displayItemIndex:newIndex, lastAction})
  }

  nextIndex(){
    const {displayItemIndex} = this.state
    const {children} = this.props

    return (displayItemIndex+1)%children.length
  }

  nextItem(){
    this.updateItem(this.nextIndex(), NAV_NEXT)
  }

  previousIndex(){
    const {children} = this.props
    const {displayItemIndex} = this.state
    return (displayItemIndex===0)?children.length-1:displayItemIndex-1
  }

  previousItem(){
    this.updateItem(this.previousIndex(), NAV_PREVIOUS)
  }

  displayItemTime(index){
    const {defaultDisplayDuration, displayItemsDuration} = this.props
    const duration = displayItemsDuration[index]

    return (duration && duration > 0)?duration:defaultDisplayDuration
  }

  getItemsToRender(){
    const {displayItemIndex, lastAction} = this.state
    const {children, permanentItems} = this.props
    const previousIndex = this.previousIndex()
    const nextIndex = this.nextIndex()

    // Render the items sorted by key
    const items = children.reduce((list, currentItem, currentIndex) => {

      let className

      // Current display item
      if(currentIndex === displayItemIndex){
        className = classnames(style.playingItemContainer, {[style.leftIn]:lastAction===NAV_NEXT, [style.rightIn]:lastAction===NAV_PREVIOUS})

      // The previous item by next click
      } else if (lastAction===NAV_NEXT && currentIndex === previousIndex){
        className = classnames(style.playingItemContainer, style.previousItemContainer, style.leftOut)

      // The previous item by previous click
      } else if (lastAction===NAV_PREVIOUS && currentIndex === nextIndex){
        className = classnames(style.playingItemContainer, style.nextItemContainer, style.rightOut)

      // Permanen tItems
      } else if (permanentItems.includes(currentIndex)){
        className = classnames(style.playingItemContainer, style.hidden)
      }

      if (className){
        list.push(
          <div className={className} key={currentIndex}>
            {currentItem}
          </div>
        )
      }

      return list
    },[])

    return items
  }

  render(){
    const {children} = this.props
    const onlyOnePhoto = children.length === 1

    return (
        <div className={classnames(style.container)}>
          <div
              className={classnames(style.previous)}
              disabled={onlyOnePhoto}
              onClick={::this.previousItem}
          />
          <div className={classnames(style.sliderDisplay)}>
            <div className={classnames(style.allItems)}>
              {this.getItemsToRender()}
            </div>
          </div>
          <div
              className={classnames(style.next)}
              disabled={onlyOnePhoto}
              onClick={::this.nextItem}
          />
          {/* <div className={classnames(style.autoplay)}>
            {autoplay?'Stop Sliding':'Auto Sliding'}
          </div> */}
        </div>
    )
  }
}
