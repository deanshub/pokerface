import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import style from './style.css'
import Chips from './Chips'
import {textToAction,selectColor} from '../../utils/actionsHelper'

export default class Bet extends Component {
  static propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    text: PropTypes.string,
  }


  render(){
    const {text, amount, currency, index} = this.props
    const action = textToAction(text)
    const color = selectColor(action)

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
