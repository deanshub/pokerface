import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Checkbox extends Component {
  static defaultProps = {
    autoWidth: false,
  }

  constructor(props){
    super(props)
    const {checked} = props
    this.state = {checked}
  }

  componentWillReceiveProps(nextProps){
    const {checked: nextChecked} = nextProps
    const {checked} = this.state
    if (checked !== nextChecked){
      this.setState({checked:nextChecked})
    }
  }

  onToggle(e){
    const {onChange} = this.props
    const {checked} = e.target
    this.setState({checked})
    onChange(e,e.target)
  }

  render(){
    const {
      autoWidth,
      id,
      label,
      checkboxLabel,
      centered,
      style: customStyle,
      toggleStyle,
      transparent,
    } = this.props
    const {checked} = this.state
    return(
      <div className={classnames(style.field, {[style.centered]:centered})} style={customStyle}>
        {label&&<label className={classnames(style.label)} htmlFor={id}>{label}</label>}
        <div className={classnames(
          style.checkboxContainer,
          {[style.toggle]: toggleStyle, [style.transparent]:transparent}
        )}>
          <input
              checked={checked}
              className={classnames(style.box)}
              id={id}
              onChange={::this.onToggle}
              type="checkbox"
          />
          <label className={classnames(style.checkboxLabel,{[style.autoWidth]:autoWidth})} htmlFor={id}>
            {checkboxLabel}
          </label>
        </div>
      </div>
    )
  }
}
