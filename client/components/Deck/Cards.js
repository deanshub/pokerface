import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import cssStyle from './style.css'
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
    const {cards, hand, rotate, style} = this.props

    return (
      <div
          className={classnames({
            [cssStyle.rotateHand]: rotate,
          })}
          style={style}
      >
        <ul className={classnames({
          [cssStyle.simpleCards]:true,
          [cssStyle.hand]: hand,
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
