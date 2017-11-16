import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class PokerTable extends Component {
  static propTypes = {
    edgeColor: PropTypes.string,
    fabricColor: PropTypes.string,
    standalone: PropTypes.bool,
    title: PropTypes.string,
  }
  static defaultProps = {
    fabricColor: '#388E3C',
    edgeColor: '#353535',
    title: 'Pokerface.io',
    standalone: false,
  }

  render() {
    const {children, title, standalone, fabricColor, edgeColor} = this.props
    return (
      <div
          className={classnames(
            style.table,
            {[style.standalone]:standalone}
          )}
          style={{backgroundColor: edgeColor}}
      >
        {children}
        <div className={classnames(style.edge)} style={{backgroundColor: fabricColor}}>
          <div className={classnames(style.fabric)} style={{backgroundColor: fabricColor}}>
            <div className={classnames(style.text)}>
              {title}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
