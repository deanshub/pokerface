import React, { Component } from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.min.css'
import classnames from 'classnames'
import style from './style.css'

export default class InputSelect extends Component{
  static defaultProps = {
    labelKey: 'text',
  }

  constructor(props){
    super(props)

    const {defaultValue} = this.props
    this.state = {value:defaultValue?defaultValue:''}
  }

  handleChange = (selectedOption) => {
    const {labelKey, onChange} = this.props

    onChange(selectedOption.value)
    this.setState({value:selectedOption[labelKey]})
  }

  render(){
    const {
      label,
      labelKey,
      options,
      error,
      warning
    } = this.props
    const {value} = this.state
//inputRenderer={()=><input className={style.selectInput}/>}
    return (
      <div className={classnames(style.field)}>
        {label&&<label className={classnames(style.label)}>{label}</label>}
        <Select
            className={classnames(
              style.inputContainer,
              {[style.selectError]: error},
              {[style.selectWarning]: warning},
            )}
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
