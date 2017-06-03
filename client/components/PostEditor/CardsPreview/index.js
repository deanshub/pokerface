// @flow

import React, { Component, PropTypes } from 'react'
import Cards from '../../Deck/Cards'
import {cardRegex} from '../CardsPlugin/cardsRegex'

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
          style={{flex:1}}
      />
    )
  }

  render(){
    const {cards} = this.props
    if (cards.length===0){
      return null
    }

    return (
      <div style={{marginBottom:10, display:'flex'}}>
        {cards.map(this.getCardsElement)}
      </div>
    )
  }
}
