import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Checkbox extends Component {
  static defaultProps = {

  }

  render(){
    const {
      id,
      label,
      checkboxLabel,
      onChange,
      value,
    } = this.props

    return(
      <div className={classnames(style.field)}>
        {label&&<label className={classnames(style.label)} htmlFor={id}>{label}</label>}
        <div className={classnames(style.checkboxContainer)}>
          <input
              className={classnames(style.box)}
              id={id}
              onChange={(e)=>onChange(e,e.target)}
              ref={el=>this.input=el}
              type="checkbox"
              value={value}
          />
          <label className={classnames(style.checkboxLabel)} htmlFor={id}>{checkboxLabel}</label>
        </div>
      </div>
    )
  }
}
