import React, { Component } from 'react'
import style from './style.css'

export default class CardBlock extends Component {
  render(){
    const { children } = this.props

    return(
      <span className={style.cardBlock}>
        {children}
      </span>
    )
  }
}
