import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PokerTable from '../PokerTable'
import PlayersList from './PlayersList'
import classnames from 'classnames'
import style from './style.css'
import { observer, inject } from 'mobx-react'

@observer
export default class Spot extends Component {
  static propTypes = {
    currency: PropTypes.string,
    dealer: PropTypes.shape().isRequired,
    movesTotal: PropTypes.number.isRequired,
    standalone: PropTypes.bool,
  }

  static defaultProps = {
    currency: '$',
    standalone: false,
  }

  splitPlayers(players){
    const upperPlayersAmount = Math.ceil(players.length/2)
    return {
      upperPlayers: players.slice(0, upperPlayersAmount),
      lowerPlayers: players.slice(upperPlayersAmount),
      upperPlayersAmount,
    }
  }

  render() {
    const { players, standalone, currency, dealer, tableBranding} = this.props
    const {upperPlayers, lowerPlayers, upperPlayersAmount} = this.splitPlayers(players)

    const { logo, title, primaryColor, secondaryColor, tertiaryColor } = tableBranding || {}
    // <foreignObject x="0" y="0" width="100%" height="80%">
    return (
        <div className={classnames(style.spot)}>
          <PlayersList
              currency={currency}
              playerStartIndex={0}
              players={upperPlayers}
          />
          <PokerTable
              currency={currency}
              dealer={dealer}
              edgeColor={secondaryColor}
              fabricColor={primaryColor}
              lineColor={tertiaryColor}
              logo={logo}
              lowerPlayers={lowerPlayers}
              standalone={standalone}
              title={title}
              upperPlayers={upperPlayers}
          />
          <PlayersList
              currency={currency}
              playerStartIndex={upperPlayersAmount}
              players={lowerPlayers}
          />
        </div>
    )
  // </foreignObject>
  }
}
