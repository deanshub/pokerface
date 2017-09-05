import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import {SUITES, normalizeSuite, normalizeRank} from './consts'

//TODO: take care of joker card
//TODO: take care of clickable cards

export default class Card extends Component {
  static propTypes = {
    active: PropTypes.bool,
    covered: PropTypes.bool,
    coveredText: PropTypes.string,
    noHoverEffect: PropTypes.bool,
    rank: PropTypes.string,
    size: PropTypes.number,
    suit: PropTypes.string,
  }
  static defaultProps = {
    active: false,
    covered: false,
    coveredText: 'Pokerface.io',
    noHoverEffect: false,
    size: 3.5,
  }

  render() {
    const {rank, suit, covered, coveredText, noHoverEffect, size, active} = this.props
    const normalizedRank = normalizeRank(rank)
    const normalizedSuit = normalizeSuite(suit)
    const letterAttr = {
      'data-letter': `${normalizedRank.toUpperCase()}\u2005${SUITES[normalizedSuit]}`,
      'data-reverse-letter': `${SUITES[normalizedSuit]}\u2005${normalizedRank.toUpperCase()}`,
    }

    return (
      <li
          className={classnames(
            style.card,
            {[style.hover]:!noHoverEffect},
            {[style.active]:active},
            {[style.back]:covered},
            {[style.red]:SUITES[normalizedSuit]===SUITES.hearts||SUITES[normalizedSuit]===SUITES.diams},
            {[style.black]:SUITES[normalizedSuit]===SUITES.spades||SUITES[normalizedSuit]===SUITES.clubs}
          )}
          style={{
            width: `${size}vw`,
            height: `${size*1.4}vw`,
            fontSize: `${size/(covered?4.5:1.3)}vw`,
          }}
          {...letterAttr}
      >
          {covered?
            coveredText
            :
            SUITES[normalizedSuit]
          }
      </li>
    )
  }
}
