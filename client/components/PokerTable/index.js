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
    fabricColor: PropTypes.string,
    logo: PropTypes.string,
    standalone: PropTypes.bool,
    title: PropTypes.string,
    lowerPlayers: PropTypes.array,
    upperPlayers: PropTypes.array,
  }

  static defaultProps = {
    fabricColor: '#41c86a',
    title: 'Pokerface.io',
    standalone: false,
    logo: pokerfaceLogo,
  }

  render() {
    const {
      title,
      standalone,
      fabricColor,
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
          style={{backgroundColor: fabricColor}}
      >
        <div className={classnames(style.backgroundContainer)}>
          {
            title?(
              <div className={classnames(style.text)}>
                {title}
              </div>
            ):null
          }
          {
            logo ?
            <div className={style.logo} style={{backgroundImage:`url('${logo}')`}}/>
            : null
          }
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
