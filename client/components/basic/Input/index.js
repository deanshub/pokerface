import React, { Component } from 'react'
import Tooltip from '../Tooltip'
import CardSelection from '../../AddPlay/CardSelection'
import Button from '../Button'
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
      padded,
      focus,
      transparent,
      hideRightButtonDivider,
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
        <div
            className={classnames(
                style.inputContainer,
                {[style.transparent]: transparent},
                {[style.error]: error},
                {[style.warning]: warning},
                {[style.range]:type==='range'}
            )}
            style={{borderColor}}
        >
          <input
              autoFocus={focus}
              className={classnames(
                style.input,
                {[style.padded]: padded},
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
            <Tooltip
                className={classnames(style.cardSelectionButton)}
                open={open}    
                trigger={
                  <Button
                      leftIcon="cardSmallFrame"
                      small
                      smallIcon
                  />
                }
            >
              <CardSelection
                  amount={amount}
                  onCardSelected={::this.cardSelectChange}
              />
            </Tooltip>
          }
          {
            rightButton&&!hideRightButtonDivider&&
            <div className={classnames(style.divider)}/>
          }
          {rightButton}
        </div>
      </div>
    )
  }
}
