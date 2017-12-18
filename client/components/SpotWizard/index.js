// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Modal } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import Spot from '../Spot'
import GeneralSettings from './GeneralSettings'
import ActionBar from './ActionBar'
import MOVES from '../../containers/SpotPlayer/constants'
import utils from '../../containers/SpotPlayer/utils'
import classnames from 'classnames'
import style from './style.css'
import {getUnimportantCard} from '../../components/Deck/consts'
const unimportantCard = getUnimportantCard()

@inject('spotPlayer')
@inject('players')
@inject('auth')
@observer
export default class SpotWizard extends Component {
  componentWillMount(){
    const {spotPlayer, players, auth} = this.props
    spotPlayer.initNewPost()
    players.setAuthenticatedUser(auth.user)
  }

  cancel(){
    const {spotPlayer} = this.props
    spotPlayer.cancelNewPost()
  }
  save(){
    const {spotPlayer} = this.props
    spotPlayer.spotWizardOpen=false
  }

  getMainContent(){
    const {spotPlayer} = this.props

    if (spotPlayer.newSpot.step===0){
      return (
        <GeneralSettings
            settings={spotPlayer.newSpot.generalSettings}
        />
      )
    }else if (spotPlayer.newSpot.step===1) {
      return(
        <Spot
            currency={spotPlayer.newSpot.spotPlayerState.currency}
            dealer={spotPlayer.newSpot.spotPlayerState.dealer}
            movesTotal={spotPlayer.newSpot.spot.moves.length}
            players={spotPlayer.newSpot.spotPlayerState.players}
        />
      )
    }
  }

  nextStep(){
    if (this.nextStepDisabled()) return undefined
    const {spotPlayer, players} = this.props
    // console.log(players.currentPlayers, spotPlayer.newSpot.spot.players);
    if (spotPlayer.newSpot.step===0){
      spotPlayer.newSpot.spot.players = players.currentPlayers.values().map((player, playerIndex)=>{
        spotPlayer.newSpot.spot.cards[playerIndex] = player.cards
        return {
          bank: 100,
          ...player,
        }
      })
      spotPlayer.newSpot.spot.ante=spotPlayer.newSpot.generalSettings.ante||0
      // TODO:normalize spotPlayer.newSpot.generalSettings.currency
      spotPlayer.newSpot.spot.currency=MOVES.CURRENCIES.DOLLAR
      spotPlayer.newSpot.spot.moves = players.currentPlayers.values().filter(player=>player.showCards&&player.cards)
        .map((player, playerIndex)=>{
          return {
            player: playerIndex,
            action:MOVES.PLAYER_META_ACTIONS.SHOWS,
          }
        })
      spotPlayer.newSpot.spot.moves.push({
        player:spotPlayer.newSpot.generalSettings.dealer,
        action:MOVES.PLAYER_META_ACTIONS.DEALER,
      })
      spotPlayer.reset(spotPlayer.newSpot)
      spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)

      if (spotPlayer.newSpot.generalSettings.sb){
        this.smallBlind()
      }

      if (spotPlayer.newSpot.generalSettings.bb){
        this.bigBlind()
      }
      spotPlayer.newSpot.step++
    }else if(spotPlayer.newSpot.step===1){
      this.save()
      spotPlayer.newSpot.step=0
    }
  }

  previousStep(){
    if (this.previousStepDisabled()) return undefined
    const {spotPlayer} = this.props
    spotPlayer.newSpot.step--
  }

  nextStepDisabled(){
    const {spotPlayer, players} = this.props
    if (spotPlayer.newSpot.step>1){
      return true
    }else if (spotPlayer.newSpot.step===0 && players.currentPlayersArray.length<2){
      return true
    }
    return false
  }
  previousStepDisabled(){
    const {spotPlayer} = this.props
    return spotPlayer.newSpot.step===0
  }

  showCards(){
    const {spotPlayer} = this.props
    spotPlayer.newSpot.spot.moves.push({
      player: utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState),
      action: MOVES.PLAYER_META_ACTIONS.SHOWS,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
  }
  smallBlind(){
    const {spotPlayer} = this.props
    spotPlayer.newSpot.spot.moves.push({
      player: utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState),
      action: MOVES.PLAYER_ACTIONS.SMALLBLIND,
      value: spotPlayer.newSpot.generalSettings.sb,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState.totalRaise = spotPlayer.newSpot.generalSettings.sb
  }
  bigBlind(){
    const {spotPlayer} = this.props
    spotPlayer.newSpot.spot.moves.push({
      player: utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState),
      action: MOVES.PLAYER_ACTIONS.BIGBLIND,
      value: spotPlayer.newSpot.generalSettings.bb,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState.totalRaise = spotPlayer.newSpot.generalSettings.bb
  }
  call(){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.CALL,
      value: spotPlayer.newSpot.spotPlayerState.totalRaise - spotPlayer.newSpot.spotPlayerState.players[player].bet,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
  }
  fold(){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.FOLD,
    })

    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
  }
  check(){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.CHECK,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
  }
  raise(value){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.RAISE,
      value: value - spotPlayer.newSpot.spotPlayerState.players[player].bet,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState.totalRaise = value
  }
  dealer(cards){
    const {spotPlayer} = this.props
    const dealerMoves = spotPlayer.newSpot.spot.moves.filter((move)=>move.player===MOVES.DEALER)
    const flop = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.FLOP)!==undefined
    const turn = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.TURN)!==undefined
    const river = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.RIVER)!==undefined
    if (!flop){
      spotPlayer.newSpot.spot.moves.push({
        player: MOVES.DEALER,
        action: MOVES.DEALER_ACTIONS.FLOP,
        value: cards,
      })
    }else if(!turn){
      spotPlayer.newSpot.spot.moves.push({
        player: MOVES.DEALER,
        action: MOVES.DEALER_ACTIONS.TURN,
        value: cards,
      })
    }else if(!river){
      spotPlayer.newSpot.spot.moves.push({
        player: MOVES.DEALER,
        action: MOVES.DEALER_ACTIONS.RIVER,
        value: cards,
      })
    }else{
      return undefined
    }
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState.totalRaise = 0
  }

  isSmallBlindDisabled(){
    const {spotPlayer} = this.props
    const playersMoves = spotPlayer.newSpot.spot.moves.filter((move)=>{
      return move.action!==MOVES.PLAYER_META_ACTIONS.DEALER &&
            move.action!==MOVES.PLAYER_META_ACTIONS.SHOWS &&
            move.action!==MOVES.PLAYER_META_ACTIONS.MOCKS
    })
    return playersMoves.length>0
  }

  isBigBlindDisabled(){
    const {spotPlayer} = this.props
    const playersMoves = spotPlayer.newSpot.spot.moves.filter((move)=>{
      return move.action!==MOVES.PLAYER_META_ACTIONS.DEALER &&
            move.action!==MOVES.PLAYER_META_ACTIONS.SHOWS &&
            move.action!==MOVES.PLAYER_META_ACTIONS.MOCKS &&
            move.action!==MOVES.PLAYER_ACTIONS.SMALLBLIND

    })
    return playersMoves.length>0
  }

  isDealerTurn(){
    const {spotPlayer, players} = this.props
    if (spotPlayer.newSpot.spotPlayerState && spotPlayer.newSpot.spotPlayerState.raiser!==undefined){
      const playersInBets = spotPlayer.newSpot.spotPlayerState.players.filter(player=>!player.folded && player.bet!==undefined)
      // all bets are the same
      if (playersInBets.length>1){
        const betValue = playersInBets[0].bet
        if (betValue){
          const differentBetPlayers = playersInBets.filter(player=>player.bet!==betValue)
          return differentBetPlayers.length===0
        }else{
          return spotPlayer.newSpot.spotPlayerState.raiser===utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
        }
      }
    }
    return false
  }

  isNoRaiser(){
    const {spotPlayer} = this.props

    return  spotPlayer.newSpot.spotPlayerState && spotPlayer.newSpot.spotPlayerState.totalRaise===0
  }

  hasRaise(){
    const {spotPlayer} = this.props
    return spotPlayer.newSpot.spotPlayerState && spotPlayer.newSpot.spotPlayerState.totalRaise>0
  }

  canShowCards(){
    const {spotPlayer} = this.props
    if (spotPlayer.newSpot.spotPlayerState){
      const playerIndex = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
      const player = spotPlayer.newSpot.spotPlayerState.players[playerIndex]
      if (player.cards && player.cards[0].rank!==unimportantCard.rank){
        const playersShowMoves = spotPlayer.newSpot.spot.moves.find((move)=>{
          return move.action===MOVES.PLAYER_META_ACTIONS.SHOWS &&
                move.player===playerIndex
        })
        return playersShowMoves===undefined
      }
    }
    return false
  }

  getCurrentPlayerBank(){
    const {spotPlayer} = this.props
    if (spotPlayer.newSpot.spotPlayerState){
      const currentPlayerIndex = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
      const player = spotPlayer.newSpot.spotPlayerState.players[currentPlayerIndex]
      if (player){
        return player.bank
      }
    }
    return 0
  }

  getMinimumRaise(){
    const {spotPlayer} = this.props
    if (spotPlayer.newSpot.spotPlayerState){
      return (spotPlayer.newSpot.spotPlayerState.totalRaise||0)+(spotPlayer.newSpot.generalSettings.bb||0)
    }
    return 0
  }

  render(){
    const {spotPlayer} = this.props
    const {step} = spotPlayer.newSpot

    const dealerMoves = spotPlayer.newSpot.spot.moves.filter((move)=>move.player===MOVES.DEALER)
    const flop = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.FLOP)!==undefined
    const turn = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.TURN)!==undefined
    const river = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.RIVER)!==undefined
    let dealerNextState
    if (!flop){
      dealerNextState='Flop'
    }else if(!turn){
      dealerNextState='Turn'
    }else if(!river){
      dealerNextState='River'
    }else{
      dealerNextState='none'
    }

    const smallBlindDisabled = this.isSmallBlindDisabled()
    const bigBlindDisabled = this.isBigBlindDisabled()
    const dealerTurn = this.isDealerTurn()
    const noRaiser = this.isNoRaiser()
    const hasRaise = this.hasRaise()
    const showCardsDisabled = !this.canShowCards()
    const currentPlayerBank = this.getCurrentPlayerBank()
    const minimumRaise = this.getMinimumRaise()

    return (
      <Modal
          closeIcon={{
            name: 'close',
            onClick: ::this.cancel,
          }}
          open={spotPlayer.spotWizardOpen}
          size="fullscreen"
      >
        <Modal.Header>
          Spot Wizard
        </Modal.Header>

        <Modal.Content className={classnames(style.spotContainer)} style={{height:'80vh'}}>
          {this.getMainContent()}
        </Modal.Content>
        <ActionBar
            step={spotPlayer.newSpot.step}
            previousClick={::this.previousStep}
            previousDisabled={step<1}
            nextClick={::this.nextStep}
            nextDisabled={this.nextStepDisabled()}
            smallBlindClick={::this.smallBlind}
            smallBlindDisabled={smallBlindDisabled}
            bigBlindClick={::this.bigBlind}
            bigBlindDisabled={bigBlindDisabled}
            foldClick={::this.fold}
            foldDisabled={dealerTurn}
            callClick={::this.call}
            callDisabled={dealerTurn || noRaiser}
            checkClick={::this.check}
            checkDisabled={dealerTurn || hasRaise}
            raiseClick={::this.raise}
            raiseDisabled={dealerTurn}
            minimumRaise={minimumRaise}
            maximumRaise={currentPlayerBank}
            showCardsClick={::this.showCards}
            showCardsDisabled={showCardsDisabled}
            saveDisabled={this.previousStepDisabled()}
            save={::this.save}
            dealerDisabled={!dealerTurn}
            dealerClick={::this.dealer}
            dealerNextState={dealerNextState}
        />
      </Modal>
    )
  }

}
