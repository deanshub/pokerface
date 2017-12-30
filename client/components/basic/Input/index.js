import React, { Component } from 'react'
import DropDown from '../DropDown'
import CardSelection from '../../AddPlay/CardSelection'

import classnames from 'classnames'
import style from './style.css'

export default class Input extends Component {
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
      cardSelection,
      rightButton,// rightButton={name,onClick,active}
      ...otherProps
    } = this.props

    return(
      <div className={classnames(style.field)} onClick={onClick||::this.focus}>
        {label&&<label className={classnames(style.label)} htmlFor={id}>{label}</label>}
        <div className={classnames(style.inputContainer)}>
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
                  amount={2}
                  onCardSelected={(cards)=>onChange(null,{value: cards})}
              />
            </DropDown>
          }
          {
            rightButton&&
            <div className={classnames(style.divider)}/>
          }
          {
            rightButton&&
            <button
                className={classnames(
                  style.button,
                  style[rightButton.name],
                  style.rightBorder,
                  {[style.active]: rightButton.active},
                )}
                onClick={(e)=>rightButton.onClick(e, e.target)}
            />
          }
        </div>
      </div>
    )
  }
}
