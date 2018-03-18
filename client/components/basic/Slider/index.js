import React, { Component } from 'react'
import KeyHandler, {KEYDOWN} from 'react-key-handler'
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
    defaultDisplayDuration: 20
  }

  constructor(props){
    super(props)
    const {autoplay, displayItemIndex, displayItemsDuration} = props
    this.state = {autoplay, displayItemIndex, displayItemsDuration}
  }

  componentDidMount(){
    const {autoplay, children} = this.props
    const childrenArr = React.Children.toArray(children)

    if (autoplay && childrenArr.length > 1){
      this.setAutoplayTimeout()
    }
  }

  componentWillReceiveProps(nextProps){
    const {autoplay, displayItemsDuration} = nextProps
    this.setState({autoplay, displayItemsDuration})

    if (autoplay){
      clearTimeout(this.timeout)
      this.setAutoplayTimeout()
    }else{
      clearTimeout(this.timeout)
    }
  }

  componentWillUnmount(){
    clearTimeout(this.timeout)
  }

  setAutoplayTimeout(){
    const {displayItemIndex} = this.state

    this.timeout = setTimeout(()=>this.nextItem(), this.displayItemTime(displayItemIndex))
  }

  updateItem(newIndex, lastAction){
    const {autoplay} = this.props

    this.setState({displayItemIndex:newIndex, lastAction},()=>{
      if (autoplay){
        clearTimeout(this.timeout)
        this.setAutoplayTimeout()
      }
    })

    return newIndex
  }

  nextIndex(){
    const {displayItemIndex} = this.state
    const {children} = this.props
    const childrenArr = React.Children.toArray(children)

    return (displayItemIndex+1)%childrenArr.length
  }

  nextItem(){
    return this.updateItem(this.nextIndex(), NAV_NEXT)
  }

  previousIndex(){
    const {children} = this.props
    const {displayItemIndex} = this.state
    const childrenArr = React.Children.toArray(children)
    return (displayItemIndex===0)?childrenArr.length-1:displayItemIndex-1
  }

  previousItem(){
    return this.updateItem(this.previousIndex(), NAV_PREVIOUS)
  }

  displayItemTime(index){
    const {defaultDisplayDuration} = this.props
    const {displayItemsDuration} = this.state
    const duration = displayItemsDuration[index]

    return (!isNaN(duration) && duration > 0)?duration*1000:defaultDisplayDuration*1000
  }

  getItemsToRender(){
    const {displayItemIndex, lastAction} = this.state
    const {children, permanentItems} = this.props
    const previousIndex = this.previousIndex()
    const nextIndex = this.nextIndex()

    const childrenArr = React.Children.toArray(children)

    // Render the items sorted by key
    const items = childrenArr.reduce((list, currentItem, currentIndex) => {

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

  moveSlide(side){
    if (side==='right'){
      this.nextItem()
    }else{
      this.previousItem()
    }
  }

  render(){
    const {children, style:customStyle, className:customClassName} = this.props
    const childrenArr = React.Children.toArray(children)
    const moreThenOnePhoto = childrenArr.length && (childrenArr.length > 1)

    return (
      <div
          className={classnames(style.container, customClassName)}
          style={customStyle}
      >
        <KeyHandler
            keyEventName={KEYDOWN}
            keyValue="ArrowRight"
            onKeyHandle={()=>this.moveSlide('right')}
        />
        <KeyHandler
            keyEventName={KEYDOWN}
            keyValue="ArrowLeft"
            onKeyHandle={()=>this.moveSlide('left')}
        />
        <div className={classnames(style.sliderDisplay)}>
          <div className={classnames(style.allItems)}>
            {this.getItemsToRender()}
          </div>
        </div>
        {
          moreThenOnePhoto&&
          <div
              className={classnames(style.previous, {[style.disabledNavButton]:!moreThenOnePhoto})}
              onClick={moreThenOnePhoto? ()=>this.moveSlide('left') : undefined}
          />
        }
        {
          moreThenOnePhoto&&
          <div
              className={classnames(style.next, {[style.disabledNavButton]:!moreThenOnePhoto})}
              onClick={moreThenOnePhoto? ()=>this.moveSlide('right') : undefined}
          />
        }
        {/* <div className={classnames(style.autoplay)}>
          {autoplay?'Stop Sliding':'Auto Sliding'}
        </div> */}
      </div>
    )
  }
}
