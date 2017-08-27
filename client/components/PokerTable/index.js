import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class PokerTable extends Component {
  static propTypes = {
    title: PropTypes.string,
  }
  static defaultProps = {
    title: 'Pokerface.io',
  }

  render() {
    const {children, title} = this.props
    return (
      <div className={classnames(style.table)}>
        {title}
        {children}
      </div>
    )
  }
}
