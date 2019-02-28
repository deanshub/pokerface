import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames'
import Input from '../../components/basic/Input'
import Button, {ButtonGroup} from '../../components/basic/Button'
import PlayerField from './PlayerField'
import { observer, inject } from 'mobx-react'
import style from './cashCalculator.css'

@inject('players')
@inject('auth')
@observer
class CashCalculator extends Component {
  playersAmountChange(e, {value}){
    const {players} = this.props
    const newAmount = parseInt(value)
    if (players.currentPlayers.length<newAmount){
      const amountOfPlayerToAdd = newAmount - players.currentPlayers.length
      const anonymosPlayers = players.currentPlayers.filter((player)=>/^Player (\d)+$/.test(player.fullname))
      const lastIndex = anonymosPlayers.reduce((res,player)=>{
        const curNumber = parseInt(player.fullname.substring('Player '.length))
        if (res>curNumber){
          return res
        }else {
          return curNumber
        }
      },0)
      for (let index = 0; index<amountOfPlayerToAdd; index++) {
        players.addGuest({
          fullname:`Player ${lastIndex + index+1}`,
          bank: players.initialBuyIn,
          buyIns: [{value: players.initialBuyIn}],
        })
      }
      setTimeout(()=>{
        this.playersElement.scrollTop=this.playersElement.scrollHeight
      })
    }else if(players.currentPlayers.length>newAmount && newAmount>0){
      const amountOfPlayerToDelete = players.currentPlayers.length-newAmount

      for (let index = 0; index<amountOfPlayerToDelete; index++) {
        players.currentPlayers.splice(players.currentPlayers.length-1,1)
      }
    }
  }

  render() {
    const {players, auth} = this.props
    return(
      <div className={classnames(style.container)}>
        <Input
            label="Initial Buy-In"
            onChange={(e,{value})=>players.initialBuyIn =value}
            placeholder="100"
            type="number"
            value={players.initialBuyIn}
        />
        <div className={classnames(style.playersContainer)} ref={el=>this.playersElement=el}>
          {players.currentPlayers.length<10&&
            <div>
              <Button active onClick={(e)=>this.playersAmountChange(e,{value:players.currentPlayers.length+1})}>
                Add a player
              </Button>
            </div>
          }
          {
            players.currentPlayers.map((user, playerIndex)=>{
              return (
                <PlayerField
                    changePlayer={player=>players.setPlayer(playerIndex, player)}
                    key={playerIndex}
                    playerIndex={playerIndex}
                    user={user}
                />
              )
            })
          }
        </div>
        <ButtonGroup center>
          <Button
            primary
            onClick={(e)=>console.log(e)}
          >
            Cash-Out
          </Button>
        </ButtonGroup>
      </div>
    )
  }
}

export default CashCalculator
