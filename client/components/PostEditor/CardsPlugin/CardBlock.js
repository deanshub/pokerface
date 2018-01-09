import React, { Component } from 'react'
import style from './style.css'
import classnames from 'classnames'
import CardsPreview from '../CardsPreview'
import ReactDOM from 'react-dom'

export default class CardBlock extends Component {
  constructor(props){
    super(props)
    this.state={
      cardsPreviewElementWidth: null,
    }
  }

  componentDidMount(){
    this.resetWidth()
  }

  componentDidUpdate(){
    this.resetWidth()
  }

  resetWidth(){
    const element = ReactDOM.findDOMNode(this.cardsPreviewElement)
    const cardsPreviewElementWidth = parseFloat(getComputedStyle(element).width)
    if (!isNaN(cardsPreviewElementWidth)&&cardsPreviewElementWidth!==this.state.cardsPreviewElementWidth){
      this.setState({
        cardsPreviewElementWidth,
      })
    }
  }

  render(){
    const { children } = this.props
    const { cardsPreviewElementWidth } = this.state

    const cardsText = children[0].props.text
    return(
      <span>
        <span className={classnames(style.cardBlock)}>
          {children}
        </span>
        <CardsPreview
            cards={[cardsText]}
            ref={(el)=>this.cardsPreviewElement = el}
        />
        <span
            className={classnames(style.spaceKeeper)}
            style={{width:cardsPreviewElementWidth}}
        />
      </span>
    )
  }
}
