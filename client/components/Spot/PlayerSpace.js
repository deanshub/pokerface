import React, { Component, PropTypes } from 'react'

import Cards from '../Deck/Cards'
import classnames from 'classnames'
import style from './style.css'

import playersPositions from './playersPositions'

export default class PlayerSpace extends Component {
  render(){
    const {playerIndex, player, currency, standalone} = this.props
    const bottomPlayer = playerIndex>1 && playerIndex<7
    const dealerButton = player.isDealer?(
      <div className={classnames({[style.dealer]:true, [style.bottomDealer]:bottomPlayer})}>D</div>
    ): null

    return (
      <div
          className={classnames(style.playerSpace)}
          style={playersPositions[playerIndex]}
      >
        <div
            className={classnames({
              [style.playerSpaceItem]: true,
              [style.bottomClass]: bottomPlayer,
            })}
        >
          <div
              className={classnames({
                [style.avatarOverlay]: true,
                [style.turnClass]: player.myTurn,
                [style.foldedClass]: player.folded,
              })}
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
    )
  }
}
