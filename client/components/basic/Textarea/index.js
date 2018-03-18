import React, { Component } from 'react'

import classnames from 'classnames'
import style from './style.css'

export default class Textarea extends Component {
  componentDidMount(){
    this.input.addEventListener('keydown', ::this.autosize);
  }

  autosize(){
    setTimeout(() => {
      this.input.style.cssText = 'height:auto; padding:0';
      this.input.style.cssText = 'height:' + this.input.scrollHeight + 'px';
    },0);
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
      error,
      warning,
      ...otherProps
    } = this.props

    return(
      <div className={classnames(style.field)} onClick={onClick||::this.focus}>
        {label&&<label className={classnames(style.label)} htmlFor={id}>{label}</label>}
        <div className={classnames(style.inputContainer)}>
          <textarea
              className={classnames(
                style.textareaInput,
                {[style.error]: error},
                {[style.warning]: warning},
              )}
              id={id}
              onChange={(e)=>onChange(e,e.target)}
              onClick={onClick}
              placeholder={placeholder}
              ref={el=>this.input=el}
              type={type}
              value={value}
              {...otherProps}
              rows={1}
          />
        </div>
      </div>
    )
  }
}
