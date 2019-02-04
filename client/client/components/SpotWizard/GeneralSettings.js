import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import Input from '../basic/Input'
import Button from '../basic/Button'
import { observer, inject } from 'mobx-react'
import PlayerField from './PlayerField'
import classnames from 'classnames'
import style from './style.css'

@inject('players')
@observer
export default class GeneralSettings extends Component {
  renderLabel(label: Object){
    return {
      key: label.value,
      image:label.image,
      content:label.text,
      className: classnames(style.playerLabel),
    }
  }

  handleAvatarClick(e, href, playerIndex){
    const {settings} = this.props
    // e.preventDefault()
    // console.log(href);
    settings.dealer = playerIndex
  }

  playersAmountChange(e, {value}){
    const {players, settings} = this.props
    const newAmount = parseInt(value)
    if (players.currentPlayers.length<newAmount){
      const amountOfPlayerToAdd = newAmount - players.currentPlayers.length
      const anonymosPlayers = players.currentPlayers.filter((player)=>/^Villain (\d)+$/.test(player.fullname))
      const lastIndex = anonymosPlayers.reduce((res,player)=>{
        const curNumber = parseInt(player.fullname.substring('Villain '.length))
        if (res>curNumber){
          return res
        }else {
          return curNumber
        }
      },0)
      for (let index = 0; index<amountOfPlayerToAdd; index++) {
        players.addGuest({
          fullname:`Villain ${lastIndex + index+1}`,
          bank: ((settings.bb||0)*100) || ((settings.sb||0)*100) || 100,
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

  anteChange(e, {value}){
    const {settings} = this.props
    const ante = parseFloat(value)||0
    settings.ante = ante
    settings.sb = ante
    settings.bb = 2*settings.sb
  }

  smallBlindChange(e, {value}){
    const {settings} = this.props
    const sb = parseFloat(value)||0
    settings.sb = sb
    settings.bb = 2*sb
    this.changeAllBanks(settings.bb*100)
  }

  bigBlindChange(e, {value}){
    const {settings} = this.props
    settings.bb=parseFloat(value)||0
    this.changeAllBanks(settings.bb*100)
  }

  changeAllBanks(amount){
    const {players} = this.props
    let parsedAmount=100
    if(amount&& !isNaN(amount)){
      parsedAmount=amount
    }
    players.currentPlayers.forEach(player=>{
      player.bank=parsedAmount
    })
  }

  render(){
    const {players, settings} = this.props

    return (
      <div className={classnames(style.generalSettingsContainer)}>
        <div className={classnames(style.globalSettings)}>
          <Input
              error={players.currentPlayers.length>10||players.currentPlayers.length<2}
              id="form-input-control-number-players"
              label="Players"
              onChange={::this.playersAmountChange}
              onClick={(e)=>e.target.select()}
              type="number"
              value={players.currentPlayers.length}
              warning={players.currentPlayers.length===10}
          />
          <Input
              id="form-input-control-currency"
              label="Currency"
              onChange={(e,{value})=>settings.currency=value}
              placeholder="$"
              value={settings.currency}
          />
          <Input
              id="form-input-control-ante"
              label="Ante"
              onChange={::this.anteChange}
              placeholder="0"
              type="number"
              value={settings.ante}
          />
          <div className={classnames(style.blinds)}>
            <Input
                id="form-input-control-small-blind"
                label="Small Blind"
                onChange={::this.smallBlindChange}
                placeholder="1"
                type="number"
                value={settings.sb}
            />
            <Input
                id="form-input-control-big-blind"
                label="Big Blind"
                onChange={::this.bigBlindChange}
                placeholder="2"
                type="number"
                value={settings.bb}
            />
          </div>
        </div>

        <div className={classnames(style.players)} ref={el=>this.playersElement=el}>
          {
            players.currentPlayers.map((user, playerIndex)=>{
              const dealerIndex = settings.dealer||0
              return (
                <PlayerField
                    changePlayer={player=>players.setPlayer(playerIndex, player)}
                    handleAvatarClick={::this.handleAvatarClick}
                    isDealer={dealerIndex===playerIndex}
                    key={playerIndex}
                    playerIndex={playerIndex}
                    user={user}
                />
              )
            })
          }
          {players.currentPlayers.length<10&&
            <div>
              <Button onClick={(e)=>this.playersAmountChange(e,{value:players.currentPlayers.length+1})}>
                Add a player
              </Button>
            </div>
          }
        </div>
      </div>
    )
  }
}