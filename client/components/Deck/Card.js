import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import {SUITES, normalizeSuite, normalizeRank} from './consts'

export default class Card extends Component {
  static propTypes = {
    rank: PropTypes.string,
    suit: PropTypes.string,
  }

  render() {
    const {rank, suit} = this.props
    const normalizedRank = normalizeRank(rank)
    const normalizedSuit = normalizeSuite(suit)
    return (
      <li>
        <a className={classnames(style.simpleCards, style.card, style[`rank-${normalizedRank}`], style[normalizedSuit])}>
          <span className={classnames(style.rank)}>{normalizedRank.toUpperCase()}</span>
          <span className={classnames(style.suit)}>{SUITES[normalizedSuit]}</span>
        </a>
      </li>
    )
  }
}
