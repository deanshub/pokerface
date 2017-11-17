import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import pokerfaceLogo from '../../assets/logo.png'

export default class PokerTable extends Component {
  static propTypes = {
    edgeColor: PropTypes.string,
    fabricColor: PropTypes.string,
    logo: PropTypes.string,
    standalone: PropTypes.bool,
    title: PropTypes.string,
  }
  static defaultProps = {
    fabricColor: '#388E3C',
    edgeColor: '#353535',
    title: 'Pokerface.io',
    standalone: false,
    logo: pokerfaceLogo,
  }

  render() {
    const {children, title, standalone, fabricColor, edgeColor, logo} = this.props
    return (
      <div
          className={classnames(
            style.table,
            {[style.standalone]:standalone}
          )}
          style={{backgroundColor: edgeColor}}
      >
        <div className={classnames(style.edge)} style={{backgroundColor: fabricColor}}>
          <div className={classnames(style.fabric)} style={{backgroundColor: fabricColor}}>
            <div className={classnames(style.text)}>
              {title}
            </div>
            {
              logo ?
              <div className={style.logo} style={{backgroundImage:`url('${logo}')`}}/>
              : null
            }
          </div>
        </div>
        {children}
      </div>
    )
  }
}
