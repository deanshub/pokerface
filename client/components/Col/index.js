import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Col extends Component {
  static propTypes = {
    flex: PropTypes.number,
  }
  static defaultProps = {
    flex: 1,
  }
  render() {
    const {children, flex} = this.props
    return (
      <div className={classnames(style.col)} style={{flex}}>
        {children}
      </div>
    )
  }
}
