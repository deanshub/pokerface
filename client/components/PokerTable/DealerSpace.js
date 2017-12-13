import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import Cards from '../Deck/Cards'
import Bet from './Bet'
import classnames from 'classnames'
import style from './style.css'

@observer
export default class DealerSpace extends Component {
  static propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
  }

  static defaultProps = {
    amount: 0,
  }

  render(){
    const {currency, dealer} = this.props
    const amount = dealer.pot

    return (
      <div className={classnames(style.dealerSpace)}>
        <div className={classnames(style.communityCards)}>
          <Cards
              cards={dealer.cards}
              dealer
              noHoverEffect
          />
        </div>
        <div className={classnames(style.pot)}>
          <div className={classnames(style.potWidth)}>
            <Bet
                amount={amount}
                currency={currency}
                text="POT"
            />
          </div>
        </div>
      </div>
    )
  }
}
