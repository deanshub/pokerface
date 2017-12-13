import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import style from './style.css'
import Chips from './Chips'

export default class Bet extends Component {
  static propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    text: PropTypes.string,
  }

  selectColor(text){
    switch (text) {
    case 'POT':
      return '#74728c'
    case 'K': // check
      return '#39b35d'
    case 'B': // bet
      return '#d7c751'
    case 'A': // all-in
      return '#e65cc5'
    case 'R': // raise
      return '#ae73e6'
    case 'F': // fold
      return '#a0a0b5'
    case 'C': // call
      return '#25aae1'
    case 'SB': // small blind
      return '#d7c751'
    case 'BB': // small blind
      return '#d7c751'
    default:
      return '#FFFFFF'
    }
  }

  textToAction(text){
    if (!text) return undefined

    const upperCased = text.toUpperCase()

    switch (upperCased) {
    case 'CHECK':
      return 'K' // check
    case 'BET':
      return 'B' // bet
    case 'ALL-IN':
      return 'A' // all-in
    case 'RAISE':
      return 'R' // raise
    case 'FOLD':
      return 'F' // fold
    case 'CALL':
      return 'C' // call
    case 'SMALL BLIND':
      return 'SB' // small blind
    case 'BIG BLIND':
      return 'BB' // big blind
    default:
      return upperCased
    }
  }

  render(){
    const {text, amount, currency, index} = this.props
    const action = this.textToAction(text)
    const color = this.selectColor(action)

    return (
      <div className={classnames(style.betContainer)}>
        <div className={classnames(style.betText)} style={{background:color}}>
          {action}
        </div>
        <div className={classnames(style.betAmount)}>
          {amount}{currency}
        </div>
        {
          amount>0?(
            <div className={classnames(style.chips)}>
              <Chips amount={amount}/>
            </div>
          ):null
        }
      </div>
    )
  }
}
