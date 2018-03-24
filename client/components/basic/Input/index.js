import React, { Component } from 'react'
import Tooltip from '../Tooltip'
import CardSelectionTooltip from '../../CardSelection/CardSelectionTooltip'
import Button from '../Button'
import classnames from 'classnames'
import style from './style.css'

export default class Input extends Component {
  static defaultProps = {
    amount: 1,
    disable: false,
  }

  focus(){
    if (this.input){
      this.input.focus()
    }
  }

  cardSelectChange(cards){
    const {onChange} = this.props
    onChange(null,{value: cards})
  }

  render(){
    const {
      id,
      borderColor,
      containerStyle,
      disable,
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
                {[style.disable]: disable},
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
              disabled={disable}
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
            <CardSelectionTooltip
                amount={amount}
                className={style.cardSelectionButton}
                onCardSelected={::this.cardSelectChange}
                trigger={
                  <Button
                    leftIcon="cardSmallFrame"
                    small
                    smallIcon
                  />
                }
            />
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
