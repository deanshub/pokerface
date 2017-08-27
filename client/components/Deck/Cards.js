import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import cssStyle from './style.css'
import Card from './Card'

export default class Cards extends Component {
  static propTypes = {
    covered: PropTypes.bool,
    hand: PropTypes.bool,
    noHoverEffect: PropTypes.bool,
    rotate: PropTypes.bool,
  }

  static defaultProps = {
    hand: false,
    rotate: false,
    covered: false,
    noHoverEffect: false,
  }

  render() {
    const {cards, hand, rotate, style, covered, noHoverEffect} = this.props

    return (
      <div
          className={classnames({
            [cssStyle.rotateHand]: rotate,
          })}
          style={style}
      >
        <ul
            className={classnames({
              [cssStyle.simpleCards]:true,
              [cssStyle.hand]: hand,
            })}
            style={{display:'flex', listStyleType: 'none'}}
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
                  suit={suit}
              />
            )
          })}
        </ul>
      </div>
    )
  }
}
