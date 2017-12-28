import React, { Component } from 'react'
import PropTypes from 'prop-types'
import utils from '../../containers/SpotPlayer/utils'
import chipSizes from './chipSizes'
import Chip from './Chip'
const sizes = Object.keys(chipSizes).map(size=>parseFloat(size)).sort((a,b)=>b-a)

export default class Chips extends Component {
  static propTypes = {
    amount: PropTypes.number.isRequired,
  }

  render(){
    const {amount} = this.props
    const chips = utils.amountToCoins(amount, [...sizes]).reduce((res,cur)=>{
      if (!res[cur]) {
        res[cur] = 0
      }
      res[cur]++
      return res
    },{})

    return Object.keys(chips).map(size=>parseFloat(size)).sort().map((chip,index)=>{
      return (
        <Chip
            index={index}
            key={index}
            primaryColor={chipSizes[chip].primaryColor}
            seconderyColor={chipSizes[chip].seconderyColor}
        />
      )
    })

  }
}
