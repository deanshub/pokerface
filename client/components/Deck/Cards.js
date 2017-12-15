import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'
import Card from './Card'

export default class Cards extends PureComponent {
  static propTypes = {
    clickable: PropTypes.bool,
    compressed: PropTypes.bool,
    covered: PropTypes.bool,
    dealer: PropTypes.bool,
    noHoverEffect: PropTypes.bool,
    rotate: PropTypes.bool,
  }

  static defaultProps = {
    clickable: false,
    dealer: false,
    compressed: false,
    rotate: false,
    covered: false,
    noHoverEffect: false,
  }

  render() {
    const {cards, compressed, rotate, covered, noHoverEffect, clickable, dealer} = this.props

    return (
      <ul
          className={classnames(
            style.deck,
            {[style.compressed]: compressed},
            {[style.covered]: covered},
            {[style.rotate]: rotate},
            {[style.dealer]: dealer}
          )}
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
