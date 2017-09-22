// @flow

import React, { Component, PropTypes } from 'react'
import Cards from '../../Deck/Cards'
import {cardRegex} from '../CardsPlugin/cardsRegex'
import classnames from 'classnames'
import style from '../style.css'

export default class CardsPreview extends Component {
  static defaultProps = {
    cards: [],
  }

  getCardsElement(cardsBlock, index){
    let cards = []
    let card
    while (card = cardRegex.exec(cardsBlock)){
      cards.push({
        rank: card[2],
        suit: card[3],
      })
    }

    return (
      <Cards
          cards={cards}
          hand
          key={index}
      />
    )
  }

  render(){
    const {cards} = this.props
    if (cards.length===0){
      return null
    }

    return (
      <div className={classnames(style.cardsPreview)}>
        {cards.map(this.getCardsElement)}
      </div>
    )
  }
}
