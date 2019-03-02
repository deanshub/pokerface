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
    setTimeout(()=>{
      const cardsPreviewElementWidth = element.offsetWidth
      if (!isNaN(cardsPreviewElementWidth)&&cardsPreviewElementWidth!==this.state.cardsPreviewElementWidth){
        this.setState({
          cardsPreviewElementWidth,
        })
      }
    },0)
  }

  render(){
    const { children } = this.props
    const { cardsPreviewElementWidth } = this.state

    const cardsText = children[0].props.text
    return(
      <React.Fragment>
        <span className={classnames(style.cardBlock)}>
          {children}
        </span>
        <span className={classnames(style.container)}>
          <CardsPreview
              cards={[cardsText]}
              ref={(el)=>this.cardsPreviewElement = el}
          />
          <span
              className={classnames(style.spaceKeeper)}
              style={{width:cardsPreviewElementWidth}}
          />
        </span>
      </React.Fragment>
    )
  }
}
