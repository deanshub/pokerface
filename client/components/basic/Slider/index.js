import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'


const PLAYING_TIME_DURATION = 3000

export default class SliderPokerface extends Component {
  static defaultProps = {
    displayedItemIndex: 0,
  }

  constructor(props){
    super(props)
    const {autoplay, displayedItemIndex} = props
    this.state = {autoplay, displayedItemIndex}
  }

  componentDidMount(){

    const {autoplay, children} = this.props

    if (autoplay && children.length > 1){
      this.setAutoplayInterval()
    }
  }

  setAutoplayInterval(){
    const {children} = this.props

    this.interval = setInterval(() => {
      const {displayedItemIndex} = this.state
      this.setState({displayedItemIndex:(displayedItemIndex+1)%children.length})
    }, PLAYING_TIME_DURATION)
  }

  updateItem(newIndex){
    const {autoplay} = this.props

    if (autoplay){
      clearInterval(this.interval)
      this.setAutoplayInterval()
    }

    this.setState({displayedItemIndex:newIndex})
  }

  nextIndex(){
    const {displayedItemIndex} = this.state
    const {children} = this.props

    return (displayedItemIndex+1)%children.length
  }

  nextItem(){
    this.updateItem(this.nextIndex())
  }

  previousIndex(){
    const {children} = this.props
    const {displayedItemIndex} = this.state
    return (displayedItemIndex===0)?children.length-1:displayedItemIndex-1
  }

  previousItem(){
    this.updateItem(this.previousIndex())
  }

  render(){
    const {displayedItemIndex} = this.state
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
              <div className={classnames(style.playingItemContainer)} key={displayedItemIndex}>
                {children[displayedItemIndex]}
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
