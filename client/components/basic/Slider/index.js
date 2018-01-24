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
      this.interval = setInterval(() => {
        const {displayedItemIndex} = this.state
        this.setState({displayedItemIndex:(displayedItemIndex+1)%children.length})
      }, PLAYING_TIME_DURATION)
    }
  }

  updateItem(newIndex){
    const {autoplay, children} = this.props

    if (autoplay){
      clearInterval(this.interval)

      this.interval = setInterval(() => {
        const {displayedItemIndex} = this.state
        this.setState({displayedItemIndex:(displayedItemIndex+1)%children.length})
      }, PLAYING_TIME_DURATION)
    }

    this.setState({displayedItemIndex:newIndex})
  }

  next(){
    const {displayedItemIndex} = this.state
    const {children} = this.props

    this.updateItem((displayedItemIndex+1)%children.length)
  }

  previous(){
    const {displayedItemIndex} = this.state
    const {children} = this.props

    this.updateItem((displayedItemIndex===0)?children.length-1:displayedItemIndex-1)
  }

  render(){
    const {displayedItemIndex} = this.state
    const {children} = this.props
    const onlyOnePhoto = children.length === 1
    return (
        <div className={classnames(style.container)}>
          <div
              className={classnames(style.previous)}
              disabled={onlyOnePhoto}
              onClick={::this.previous}
          />
          <div className={classnames(style.sliderDisplay)}>
            <div
                className={classnames(style.allItems)}
                onClick={::this.next}
                style={{transform: `translate(${-100*(displayedItemIndex)}%,0px)`}}
            >
              {children.map((item, index) => {
                return (
                  <div className={classnames(style.playingItemContainer)} key={index}>
                    {item}
                  </div>
                )
              })}
            </div>
          </div>
          <div
              className={classnames(style.next)}
              disabled={onlyOnePhoto}
              onClick={::this.next}
          />
        </div>
    )
  }
}
