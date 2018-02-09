import React, { Component } from 'react'
import DropDown from '../DropDown'
import CardSelection from '../../AddPlay/CardSelection'

import classnames from 'classnames'
import style from './style.css'

export default class Input extends Component {
  static defaultProps = {
    amount: 1,
  }

  constructor(props){
    super(props)
    this.state = {
      open: false,
    }
  }

  focus(){
    if (this.input){
      this.input.focus()
    }
  }

  cardSelectChange(cards){
    const {onChange} = this.props
    onChange(null,{value: cards})
    this.setState({
      open: false,
    })
  }

  render(){
    const {
      id,
      borderColor,
      containerStyle,
      label,
      onChange,
      placeholder,
      value,
      type,
      onClick,
      error,
      warning,
      cardSelection,
      rightButton,
      amount,
      ...otherProps
    } = this.props

    const {open} = this.state

    return(
      <div
          className={classnames(style.field)}
          onClick={onClick||::this.focus}
          style={containerStyle}
      >
        {label&&<label className={classnames(style.label)} htmlFor={id}>{label}</label>}
        <div className={classnames(style.inputContainer, {[style.range]:type==='range'})} style={{borderColor}}>
          <input
              className={classnames(
                style.input,
                {[style.error]: error},
                {[style.warning]: warning},
                {[style.noRightBorder]: cardSelection||rightButton},
              )}
              id={id}
              onChange={(e)=>onChange(e,e.target)}
              onClick={onClick}
              placeholder={placeholder||(cardSelection?'Select Cards...':'')}
              ref={el=>this.input=el}
              type={type}
              value={value}
              {...otherProps}
          />
          {
            cardSelection&&
            <DropDown
                open={open}
                trigger={
                  <button
                      className={classnames(
                        style.button,
                        style.cardSelectionButton,
                        {[style.rightBorder]: !rightButton},
                      )}
                  />
                }
            >
              <CardSelection
                  amount={amount}
                  onCardSelected={::this.cardSelectChange}
              />
            </DropDown>
          }
          {
            rightButton&&
            <div className={classnames(style.divider)}/>
          }
          {rightButton}
        </div>
      </div>
    )
  }
}
