import React, { Component } from 'react'
import style from './style.css'

export default class CardBlock extends Component {
  render(){
    const { decoratedText } = this.props

    return(
      <span className={style.cardBlock}>
        {decoratedText}
      </span>
    )
  }
}
