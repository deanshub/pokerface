import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'
import Card from './Card'

export default class Cards extends Component {
  static propTypes = {
    clickable: PropTypes.bool,
    covered: PropTypes.bool,
    dealer: PropTypes.bool,
    hand: PropTypes.bool,
    noHoverEffect: PropTypes.bool,
    rotate: PropTypes.bool,
    size: PropTypes.number,
  }

  static defaultProps = {
    clickable: false,
    dealer: false,
    hand: false,
    rotate: false,
    covered: false,
    noHoverEffect: false,
    size: 3.5,
  }

  render() {
    const {cards, hand, rotate, covered, noHoverEffect, clickable, size, dealer} = this.props

    return (
      <ul
          className={classnames(
            style.deck,
            {[style.hand]: hand},
            {[style.rotate]: rotate},
            {[style.dealer]: dealer}
          )}
          style={{
            height: `${size*1.4}vw`,
          }}
      >
        {cards.map((card)=>{
          let key = `${card.suit}.${card.rank}`
          const suit = card.suit
          const rank = card.rank
          if (card.suit===card.rank && card.rank==='?'){
            key = `?.${Math.random()}`
          }
          return(
            <Card
                covered={covered}
                key={key}
                noHoverEffect={noHoverEffect}
                rank={rank}
                size={size}
                suit={suit}
            />
          )
        })}
      </ul>
    )
  }
}
