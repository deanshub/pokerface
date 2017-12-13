import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Bet from './Bet'
import classnames from 'classnames'
import style from './style.css'


export default class BetList extends Component {
  static propTypes = {
    currency: PropTypes.string,
    playerStartIndex: PropTypes.number,
    players: PropTypes.array,
    reversed: PropTypes.bool,
  }

  static defaultProps = {
    playerStartIndex: 0,
    reversed: false,
  }

  buildBetComponent(player, index){
    const {currency} = this.props

    return (
      <div
          className={classnames(style.playerBetContainer)}
          key={`player${index}`}
      >
        {
          player.bet?(
            <Bet
                amount={player.bet}
                currency={currency}
                text={player.lastAction}
            />
          ):null
        }
      </div>
    )
  }

  render(){
    const {players, reversed} = this.props

    if (!players || players.length<1){
      return null
    }

    return (
      <div
          className={classnames({
            [style.betList]:true,
            [style.reversed]: reversed,
          })}
      >
        {players.map(::this.buildBetComponent)}
      </div>
    )
  }
}
