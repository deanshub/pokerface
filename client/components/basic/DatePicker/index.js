import React, { Component } from 'react'
import 'react-select/dist/react-select.min.css'
import classnames from 'classnames'
import style from './style.css'
import Input from '../Input'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'

export default class InputSelect extends Component{

  render(){
    const {label, onChange, value} = this.props

    return (
      <div className={classnames(style.field)}>
        {label&&<label className={classnames(style.label)}>{label}</label>}
        <Datetime
            className={classnames(style.datePickerContainer)}
            inputProps={{className:classnames(style.datePickerInput)}}
            onChange={onChange}
            value={value}
        />
      </div>
    )
  }
}
