import React, { Component } from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.min.css'
import classnames from 'classnames'
import style from './style.css'

export default class InputSelect extends Component{
  static defaultProps = {
    labelKey: 'text',
  }

  handleChange = (selectedOption) => {
    const {onChange} = this.props
    onChange(selectedOption.value)
  }

  render(){
    const {
      label,
      labelKey,
      options,
      error,
      warning,
      value,
    } = this.props

    return (
      <div className={classnames(style.field)}>
        {label&&<label className={classnames(style.label)}>{label}</label>}
        <Select
            className={classnames(
              style.inputContainer,
              {[style.selectError]: error},
              {[style.selectWarning]: warning},
            )}
            clearable={false}
            inputProps={{className:classnames(style.selectInput)}}
            labelKey={labelKey}
            onChange={::this.handleChange}
            options={options}
            tabSelectsValue={false}
            value={value}
        />
      </div>
    )
  }
}
