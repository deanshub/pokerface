import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PlayerSpace from './PlayerSpace'
import classnames from 'classnames'
import style from './style.css'


export default class PlayersList extends Component {
  static propTypes = {
    currency: PropTypes.string,
    playerStartIndex: PropTypes.number,
    players: PropTypes.array,
  }

  static defaultProps = {
    playerStartIndex: 0,
  }

  buildPlayerComponent(player, index){
    const {playerStartIndex, currency} = this.props
    const playerIndex = playerStartIndex+index

    return (
      <PlayerSpace
          currency={currency}
          key={`player${playerIndex}`}
          player={player}
          playerIndex={playerIndex}
      />
    )
  }

  render(){
    const {players, playerStartIndex} = this.props

    if (!players || players.length<1){
      return null
    }

    const lowerPlayers = playerStartIndex>0

    return (
      <div
          className={classnames({
            [style.playersList]:true,
            [style.reversed]:lowerPlayers,
          })}
      >
        {players.map(::this.buildPlayerComponent)}
      </div>
    )
  }
}
