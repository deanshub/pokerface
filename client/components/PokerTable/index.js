import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class PokerTable extends Component {
  static propTypes = {
    standalone: PropTypes.bool,
    title: PropTypes.string,
  }
  static defaultProps = {
    title: 'Pokerface.io',
    standalone: false,
  }

  render() {
    const {children, title, standalone} = this.props
    return (
      <div
          className={classnames(
            style.table,
            {[style.standalone]:standalone}
          )}
      >
        {title}
        {children}
      </div>
    )
  }
}
