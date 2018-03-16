import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Checkbox extends Component {

  render(){
    const {
      id,
      label,
      checkboxLabel,
      onChange,
      value,
      centered,
      style: customStyle,
    } = this.props

    return(
      <div className={classnames(style.field, {[style.centered]:centered})} style={customStyle}>
        {label&&<label className={classnames(style.label)} htmlFor={id}>{label}</label>}
        <div className={classnames(style.checkboxContainer)}>
          <input
              className={classnames(style.box)}
              defaultChecked={value}
              id={id}
              onChange={(e)=>onChange(e,e.target)}
              type="checkbox"
          />
          <label className={classnames(style.checkboxLabel)} htmlFor={id}>{checkboxLabel}</label>
        </div>
      </div>
    )
  }
}
