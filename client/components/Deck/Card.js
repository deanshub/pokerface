import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import {SUITES, normalizeSuite, normalizeRank} from './consts'

export default class Card extends Component {
  static propTypes = {
    covered: PropTypes.bool,
    noHoverEffect: PropTypes.bool,
    rank: PropTypes.string,
    suit: PropTypes.string,
  }
  static defaultProps = {
    covered: false,
    noHoverEffect: false,
  }

  render() {
    const {rank, suit, covered, noHoverEffect} = this.props
    const normalizedRank = normalizeRank(rank)
    const normalizedSuit = normalizeSuite(suit)
    const coveredStyle = covered?{backgroundImage: `url(${require('./back.png')}) !important`}:undefined

    const styleRank = normalizedRank==='joker'?normalizedRank:`rank-${normalizedRank}`

    return (
      <li>
        <a
            className={classnames(
              style.simpleCards,
              style.card,
              style[styleRank],
              style[normalizedSuit],
              {[style.back]:covered},
              {[style.noHoverEffect]:noHoverEffect}
            )}
            style={coveredStyle}
        >
          {
            covered?null:(
              <span className={classnames(style.rank)}>{normalizedRank.toUpperCase()}</span>
            )
          }
          {
            covered?null:(
              <span className={classnames(style.suit)}>{SUITES[normalizedSuit]}</span>
            )
          }
        </a>
      </li>
    )
  }
}
