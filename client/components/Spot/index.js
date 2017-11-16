import React, { Component, PropTypes } from 'react'

import PokerTable from '../PokerTable'
import Bet from '../Bet'
import Cards from '../Deck/Cards'
import classnames from 'classnames'
import style from './style.css'

import playersPositions from './playersPositions'
import betPositions from './betPositions'



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

      const position = playersPositions[index]
      const betPosition = betPositions[index]
      const bottomPlayer = index>1 && index<7
      const bottomClass = bottomPlayer?style.bottomClass:undefined
      const turnClass = player.myTurn?style.turnClass:undefined
      const dealerButton = player.isDealer?(
        <div className={classnames({[style.dealer]:true, [style.bottomDealer]:bottomPlayer})}>D</div>
      ): null
      const foldedClass = player.folded?style.foldedClass:undefined
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
        <div
            className={classnames(style.playerSpace)}
            key={`player${index}`}
            style={position}
        >
          <div className={classnames(style.playerSpaceItem, bottomClass)}>
            <div
                className={classnames(style.avatarOverlay, turnClass, foldedClass)}
            >
              <img
                  className={classnames(style.avatarImage)}
                  src={player.avatar}
              />
            </div>
            <div
                className={classnames(style.playerDescription)}
            >
              {player.fullname}
            </div>
            <div
                className={classnames(style.playerDescription)}
            >
              {player.bank}{currency}
            </div>
            {dealerButton}
          </div>
          <div className={classnames(style.playerSpaceItem, style.playerSideSection)}>
            <div
                className={classnames(style.description)}
                style={{visibility:player.description?'visible':'hidden'}}
            >
              {player.description}
            </div>
            <Cards
                cards={player.cards}
                covered={!player.showCards}
                hand
                size={standalone?3.8:3.5}
            />
          </div>
        </div>
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
