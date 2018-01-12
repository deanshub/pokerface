import React, { Component } from 'react'

import classnames from 'classnames'
import style from './style.css'

export default class Textarea extends Component {
  static defaultProps = {
    rows: 1,
  }

  focus(){
    if (this.input){
      this.input.focus()
    }
  }

  render(){
    const {
      id,
      label,
      onChange,
      placeholder,
      value,
      type,
      onClick,
      ...otherProps
    } = this.props

    return(
      <div className={classnames(style.field)} onClick={onClick||::this.focus}>
        {label&&<label className={classnames(style.label)} htmlFor={id}>{label}</label>}
        <div className={classnames(style.inputContainer)}>
          <textarea
              className={classnames(style.textareaInput)}
              id={id}
              onChange={(e)=>onChange(e,e.target)}
              onClick={onClick}
              placeholder={placeholder}
              ref={el=>this.input=el}
              type={type}
              value={value}
              {...otherProps}
          />
        </div>
      </div>
    )
  }
}
