import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Row extends Component {
  // static propTypes = {
  //   children: PropTypes.element,
  // }

  render() {
    const {children} = this.props
    return (
      <div className={classnames(style.row)}>
        {children}
      </div>
    )
  }
}
