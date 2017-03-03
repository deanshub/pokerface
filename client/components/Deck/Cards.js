import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import Card from './Card'

export default class Cards extends Component {
  static propTypes = {
    cards: PropTypes.array,
    hand: PropTypes.bool,
    rotate: PropTypes.bool,
  }

  static defaultProps = {
    hand: false,
    rotate: false,
  }

  render() {
    const {cards, hand, rotate} = this.props

    return (
      <div className={classnames({
        [style.rotateHand]: rotate,
      })}
      >
        <ul className={classnames({
          [style.simpleCards]:true,
          [style.hand]: hand,
        })}
        >
          {cards.map((card)=>
            <Card
                key={`${card.suit}.${card.rank}`}
                rank={card.rank}
                suit={card.suit}
            />
          )}
        </ul>
      </div>
    )
  }
}
