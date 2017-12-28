import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Cards from '../Deck/Cards'
import classnames from 'classnames'
import style from './style.css'
import { observer, inject } from 'mobx-react'
import {textToAction,selectColor} from '../../utils/actionsHelper'

@inject('routing')
@observer
export default class PlayerSpace extends Component {
  static propTypes = {
    currency: PropTypes.string,
    playerIndex: PropTypes.number.isRequired,
  }

  getSymbol(){
    const { player } = this.props
    let symbolText

    if (player.isDealer){
      symbolText = 'D'
    }

    if (symbolText){
      return (
        <div className={classnames(style.symbol)}>
          {symbolText}
        </div>
      )
    }
    return null
  }

  avatarClicked(){
    const { player, routing } = this.props
    if (!player.guest){
      routing.push(`/profile/${player.username}`)
    }
  }

  render(){
    const { currency, player} = this.props
    const backgroundColor = selectColor(textToAction(player.description))
    let bank = player.bank%1?player.bank.toFixed(2):player.bank
    bank = parseFloat(bank).toLocaleString()

    return (
      <div
          className={
            classnames({
              [style.playerSpace]: true,
              [style.folded]: player.folded,
              [style.myTurn]: player.myTurn
            })
          }

      >
        {this.getSymbol()}
        <div
            className={classnames(style.avatar)}
            onClick={::this.avatarClicked}
            style={{backgroundImage:`url("${player.avatar}")`}}
        />
        <div className={classnames(style.cards)}>
          <Cards
              cards={player.cards}
              clickable
              covered={!player.showCards}
              rotate={player.showCards}
          />
        </div>
        <div className={classnames(style.descriptionContainer)}>
          <div className={classnames(style.name)}>
            {player.fullname}
          </div>
          <div className={classnames(style.bank)}>
            {bank}{currency}
          </div>
          <div className={classnames(style.currentAction)} style={{opacity:player.description?1:undefined, backgroundColor}}>
            {player.description}
            {/* {player.bet?} */}
          </div>
        </div>
      </div>
    )
  }
}
