import React, { Component } from 'react'
import style from './style.css'

export default class CardBlock extends Component {
  render(){
    const {
      contentState,
      decoratedText,
      entityKey,
      offsetKey,
      getEditorState,
      setEditorState,
      ...props,
    } = this.props
    return(
      <span className={style.cardBlock} {...props} />
    )
  }
}
