import React, { Component, PropTypes } from 'react'

import PokerTable from '../PokerTable'
import Bet from '../Bet'
import Cards from '../Deck/Cards'
import classnames from 'classnames'
import style from './style.css'

import betPositions from './betPositions'
import PlayerSpace from './PlayerSpace'


export default class Spot extends Component {
  static propTypes = {
    currency: PropTypes.string,
    dealer: PropTypes.shape().isRequired,
    movesTotal: PropTypes.number.isRequired,
    standalone: PropTypes.bool,
  }

  static defaultProps = {
    currency: '$',
    standalone: false,
  }

  buildPlayerComponents(player, index){
    if (player){
      const {currency, standalone} = this.props

      const betPosition = betPositions[index]
      const bottomPlayer = index>1 && index<7
      const betComponent = player.bet?(
        <Bet
            amount={player.bet}
            className={classnames({[style.bet]:true, [style.bottomBet]:bottomPlayer})}
            currency={currency}
            key={`bet${index}`}
            style={betPosition}
        />
      ): null

      // TODO:
      // click for profile (username when not guest)

      return [(
        <PlayerSpace
            currency={currency}
            key={`player${index}`}
            player={player}
            playerIndex={index}
            standalone={standalone}
        />
      ), betComponent]
    }
    return []
  }

  buildDealerComponent(){
    const { dealer, currency, standalone } = this.props

    return (
      <div className={classnames(style.dealerSpace)}>
        <div className={classnames(style.dealerPot)}>
          <Bet
              amount={dealer.pot}
              className={classnames(style.dealerBet)}
              currency={currency}
              dealerBet
          />
        </div>
        <div className={classnames(style.dealerCards)}>
          <Cards
              cards={dealer.cards}
              dealer
              noHoverEffect
              size={standalone?3.8:3.5}
          />
        </div>
      </div>
    )
  }

  render() {
    const { players, standalone } = this.props
    const dealerComponent = this.buildDealerComponent()

    return (
      <PokerTable standalone={standalone}>
        {
          players.map(::this.buildPlayerComponents).reduce((res, playerComponents)=>{
            return [...res, ...playerComponents]
          },[])
        }
        {
          dealerComponent
        }
      </PokerTable>
    )
  }
}
