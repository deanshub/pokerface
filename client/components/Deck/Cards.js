import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'
import Card from './Card'

export default class Cards extends PureComponent {
  static propTypes = {
    clickable: PropTypes.bool,
    covered: PropTypes.bool,
    dealer: PropTypes.bool,
    inline: PropTypes.bool,
    noHoverEffect: PropTypes.bool,
    rotate: PropTypes.bool,
  }

  static defaultProps = {
    clickable: false,
    dealer: false,
    inline: false,
    rotate: false,
    covered: false,
    noHoverEffect: false,
  }

  render() {
    const {cards, inline, rotate, covered, noHoverEffect, clickable, dealer, ...otherProps} = this.props

    return (
      <ul
          className={classnames(
            style.deck,
            {[style.inline]: inline},
            {[style.covered]: covered},
            {[style.rotate]: rotate},
            {[style.dealer]: dealer}
          )}
          {...otherProps}
      >
        {cards.map((card, index)=>{
          let key = `${card.suit}.${card.rank}`
          const suit = card.suit
          const rank = card.rank
          if (card.suit===card.rank && card.rank==='?'){
            key = `?.${Math.random()}`
          }

          let customStyle = {}
          if (rotate&&!covered){
            const leftRight = index<cards.length/2?-1:1
            const rotation = leftRight*15
            customStyle.transform=`rotate(${rotation}deg)`
          }

          return(
            <Card
                clickable={clickable}
                covered={covered}
                inline={inline}
                key={key}
                noHoverEffect={noHoverEffect}
                rank={rank}
                style={customStyle}
                suit={suit}
            />
          )
        })}
      </ul>
    )
  }
}
