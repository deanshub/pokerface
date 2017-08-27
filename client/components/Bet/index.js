import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import betStyle from './style.css'
import Chips from '../Chips'
import chipSizes from './chipSizes'
import utils from '../../containers/SpotPlayer/utils'
const sizes = Object.keys(chipSizes).map(size=>parseInt(size)).sort((a,b)=>b-a)

export default class Bet extends Component {
  static propTypes = {
    amount: PropTypes.number,
    className: PropTypes.string,
    currency: PropTypes.string,
    dealerBet: PropTypes.bool,
    style: PropTypes.shape(),
  }
  static defaultProps = {
    amount: 0,
    currency: '$',
    dealerBet: false,
  }

  render(){
    const {amount, className, style, currency, dealerBet} = this.props

    if (amount>0){
      const chips = utils.amountToCoins(amount, [...sizes]).reduce((res,cur)=>{
        if (!res[cur]) {
          res[cur] = 0
        }
        res[cur]++
        return res
      },{})

      const chipsComponents = Object.keys(chips).map(size=>parseInt(size)).map(chip=>{
        const multiple = chips[chip]>1
        return (
          <Chips
              amount={chip}
              currency={currency}
              key={chip}
              multiple={multiple}
              primaryColor={chipSizes[chip].primaryColor}
              seconderyColor={chipSizes[chip].seconderyColor}
              size={40}
          />
        )
      })

      return (
        <div
            className={className}
            style={style}
        >
          {chipsComponents}
          <div className={classnames(betStyle.betLabel,{[betStyle.dealerBet]:dealerBet})}>
            {dealerBet?'Pot:':''}{amount}{currency}
          </div>
        </div>
      )
    }
    return null
  }
}
