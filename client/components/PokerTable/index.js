import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import style from './style.css'
import pokerfaceLogo from '../../assets/logo.png'
import BetList from './BetList'
import DealerSpace from './DealerSpace'

export default class PokerTable extends Component {
  static propTypes = {
    currency: PropTypes.string,
    edgeColor: PropTypes.string,
    fabricColor: PropTypes.string,
    lineColor: PropTypes.string,
    logo: PropTypes.string,
    standalone: PropTypes.bool,
    title: PropTypes.string,
    lowerPlayers: PropTypes.array,
    upperPlayers: PropTypes.array,
  }

  static defaultProps = {
    fabricColor: '#41c86a',
    edgeColor: '#2b3f31',
    lineColor: '#7ee39d',
    title: 'Pokerface.io',
    standalone: false,
    logo: pokerfaceLogo,
  }

  render() {
    const {
      title,
      standalone,
      fabricColor,
      edgeColor,
      lineColor,
      logo,
      dealer,
      currency,
      lowerPlayers,
      upperPlayers
    } = this.props

    return (
      <div
          className={classnames(
            style.table,
            {[style.standalone]:standalone}
          )}
          style={{backgroundColor: fabricColor, borderColor: edgeColor}}
      >
        <div className={classnames(style.backgroundContainer)}>
          <div className={classnames(style.line)} style={{borderColor: lineColor}}>
            {
              title?(
                <div className={classnames(style.text)}>
                  {title}
                </div>
              ):null
            }
            {
              logo ?
              <div className={style.logo} style={{backgroundImage:`url('${__webpack_public_path__}${logo}')`}}/>
              : null
            }
          </div>
        </div>
        <div className={classnames(style.forgroundContainer)}>
          <BetList
              currency={currency}
              players={upperPlayers}
          />
          <DealerSpace
              currency={currency}
              dealer={dealer}
          />
          <BetList
              currency={currency}
              players={lowerPlayers}
              reversed
          />
        </div>
      </div>
    )
  }
}
