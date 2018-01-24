import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'


export default class SliderPokerface extends Component {
  static defaultProps = {
    displayItemIndex: 0,
    autoplay:false,
    displayItemsDuration:[],
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

  updateItem(newIndex){
    const {autoplay} = this.props

    if (autoplay){
      clearTimeout(this.timeout)
      this.setAutoplayTimeout()
    }

    this.setState({displayItemIndex:newIndex})
  }

  nextIndex(){
    const {displayItemIndex} = this.state
    const {children} = this.props

    return (displayItemIndex+1)%children.length
  }

  nextItem(){
    this.updateItem(this.nextIndex())
  }

  previousIndex(){
    const {children} = this.props
    const {displayItemIndex} = this.state
    return (displayItemIndex===0)?children.length-1:displayItemIndex-1
  }

  previousItem(){
    this.updateItem(this.previousIndex())
  }

  displayItemTime(index){
    const {defaultDisplayDuration, displayItemsDuration} = this.props
    const duration = displayItemsDuration[index]

    return (duration && duration > 0)?duration:defaultDisplayDuration
  }

  render(){
    const {displayItemIndex} = this.state
    const {children} = this.props
    const previousIndex = this.previousIndex()
    const nextIndex = this.nextIndex()
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
              <div
                  className={classnames(style.playingItemContainer)}
                  key={previousIndex}
                  style={{transform: 'translate(-100%,0px)'}}
              >
                {children[previousIndex]}
              </div>
              <div className={classnames(style.playingItemContainer)} key={displayItemIndex}>
                {children[displayItemIndex]}
              </div>
              <div
                  className={classnames(style.playingItemContainer)}
                  key={nextIndex}
                  style={{transform: 'translate(100%,0px)'}}
              >
                {children[nextIndex]}
              </div>
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
