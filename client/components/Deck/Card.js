import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import {SUITES} from './consts'

export default class Card extends Component {
  static propTypes = {
    rank: PropTypes.string,
    suit: PropTypes.string,
  }

  render() {
    const {rank, suit} = this.props

    return (
      <li>
        <a className={classnames(style.simpleCards, style.card, style[`rank-${rank}`], style[suit])}>
          <span className={classnames(style.rank)}>{rank}</span>
          <span className={classnames(style.suit)}>{SUITES[suit]}</span>
        </a>
      </li>
    )
  }
}
