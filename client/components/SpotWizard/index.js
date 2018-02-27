// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import Modal, {ModalHeader,ModalContent,ModalFooter} from '../basic/Modal'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import Button, {ButtonGroup} from '../basic/Button'
import Spot from '../Spot'
import GeneralSettings from './GeneralSettings'
import ActionBar from './ActionBar'
import MOVES from '../../utils/game/constants'
import utils from '../../containers/SpotPlayer/utils'
import classnames from 'classnames'
import style from './style.css'
import {getNextStep} from '../../utils/game/actions'
import {getNextPlayer} from '../../utils/game/players'
import {getUnimportantCard} from '../../components/Deck/consts'
import StepsMenu from './StepsMenu'
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
    const {auth, spotPlayer} = this.props
    const {step} = spotPlayer.newSpot

    if (step===0){
      return (
        <GeneralSettings
            settings={spotPlayer.newSpot.generalSettings}
        />
      )
    }else if (step===1) {
      const dealerMoves = spotPlayer.newSpot.spot.moves.slice(0, spotPlayer.newSpot.spotPlayerState.nextMoveIndex-1).filter((move)=>move.player===MOVES.DEALER)
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

      const nextPlayerIndex = getNextPlayer(spotPlayer.newSpot.spot.moves, spotPlayer.newSpot.spotPlayerState)

      const smallBlindDisabled = this.isSmallBlindDisabled()
      const bigBlindDisabled = this.isBigBlindDisabled()
      const gameEnded = nextPlayerIndex===null
      const dealerTurn = nextPlayerIndex===MOVES.DEALER
      const noRaiser = this.isNoRaiser()
      const hasRaise = this.hasRaise()
      const showCardsDisabled = !this.canShowCards()
      const currentPlayerBank = this.getCurrentPlayerBank()
      const minimumRaise = this.getMinimumRaise()

      return(
        <div className={classnames(style.stepTwoContainer)}>
          <ActionBar
              step={step}
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
              minimumRaise={Math.min(minimumRaise,currentPlayerBank)}
              maximumRaise={currentPlayerBank}
              showCardsClick={::this.showCards}
              showCardsDisabled={showCardsDisabled}
              saveDisabled={this.previousStepDisabled()}
              save={::this.save}
              dealerDisabled={!dealerTurn}
              dealerClick={::this.dealer}
              dealerNextState={dealerNextState}
              gameEnded={gameEnded}
              toggleStepsMenu={::this.toggleStepsMenu}
          />
          <Spot
              currency={spotPlayer.newSpot.spotPlayerState.currency}
              dealer={spotPlayer.newSpot.spotPlayerState.dealer}
              movesTotal={spotPlayer.newSpot.spot.moves.length}
              players={spotPlayer.newSpot.spotPlayerState.players}
              tableBranding={auth.user.rebrandingDetails}
          />
          <StepsMenu/>
        </div>
      )
    }
  }

  nextStep(){
    if (this.nextStepDisabled()) return undefined
    const {spotPlayer, players} = this.props

    if (spotPlayer.newSpot.step===0){
      spotPlayer.newSpot.spot.players = players.currentPlayers.map((player, playerIndex)=>{
        spotPlayer.newSpot.spot.cards[playerIndex] = player.cards
        return {
          bank: 100,
          ...player,
        }
      })
      spotPlayer.newSpot.spot.ante=spotPlayer.newSpot.generalSettings.ante||0
      // TODO:normalize spotPlayer.newSpot.generalSettings.currency
      spotPlayer.newSpot.spot.currency=MOVES.CURRENCIES.DOLLAR
      spotPlayer.newSpot.spot.moves = players.currentPlayers.filter(player=>player.showCards&&player.cards)
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
      const newSpotPlayerState = getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
      extendObservable(spotPlayer.newSpot, {spotPlayerState: newSpotPlayerState})

      if (spotPlayer.newSpot.generalSettings.sb){
        this.smallBlind()
      }

      if (spotPlayer.newSpot.generalSettings.bb){
        this.bigBlind()
      }
      spotPlayer.newSpot.step++
    }else if(spotPlayer.newSpot.step===1){
      this.save()
      spotPlayer.reset(spotPlayer.newSpot)
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
    }else if (spotPlayer.newSpot.step===0 && players.currentPlayers.length<2){
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
    const newSpotPlayerState = getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    extendObservable(spotPlayer.newSpot, {spotPlayerState: newSpotPlayerState})
  }
  smallBlind(){
    const {spotPlayer} = this.props
    spotPlayer.newSpot.spot.moves.splice(spotPlayer.newSpot.spotPlayerState.nextMoveIndex)
    spotPlayer.newSpot.spot.moves.push({
      player: utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState),
      action: MOVES.PLAYER_ACTIONS.SMALLBLIND,
      value: spotPlayer.newSpot.generalSettings.sb,
    })
    const newSpotPlayerState = getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    extendObservable(spotPlayer.newSpot, {spotPlayerState: newSpotPlayerState})
  }
  bigBlind(){
    const {spotPlayer} = this.props
    spotPlayer.newSpot.spot.moves.splice(spotPlayer.newSpot.spotPlayerState.nextMoveIndex)
    spotPlayer.newSpot.spot.moves.push({
      player: utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState),
      action: MOVES.PLAYER_ACTIONS.BIGBLIND,
      value: spotPlayer.newSpot.generalSettings.bb,
    })
    const newSpotPlayerState = getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    extendObservable(spotPlayer.newSpot, {spotPlayerState: newSpotPlayerState})
  }
  call(){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spot.moves.splice(spotPlayer.newSpot.spotPlayerState.nextMoveIndex)
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.CALL,
      value: spotPlayer.newSpot.spotPlayerState.totalRaise - spotPlayer.newSpot.spotPlayerState.players[player].bet,
    })
    const newSpotPlayerState = getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    extendObservable(spotPlayer.newSpot, {spotPlayerState: newSpotPlayerState})
  }
  fold(){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spot.moves.splice(spotPlayer.newSpot.spotPlayerState.nextMoveIndex)
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.FOLD,
    })

    const newSpotPlayerState = getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    extendObservable(spotPlayer.newSpot, {spotPlayerState: newSpotPlayerState})
  }
  check(){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spot.moves.splice(spotPlayer.newSpot.spotPlayerState.nextMoveIndex)
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.CHECK,
    })
    const newSpotPlayerState = getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    extendObservable(spotPlayer.newSpot, {spotPlayerState: newSpotPlayerState})
  }
  raise(value){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spot.moves.splice(spotPlayer.newSpot.spotPlayerState.nextMoveIndex)
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.RAISE,
      value: value - spotPlayer.newSpot.spotPlayerState.players[player].bet,
    })
    const newSpotPlayerState = getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    extendObservable(spotPlayer.newSpot, {spotPlayerState: newSpotPlayerState})
  }
  dealer(cards){
    const {spotPlayer} = this.props
    const dealerMoves = spotPlayer.newSpot.spot.moves.slice(0,spotPlayer.newSpot.spotPlayerState.nextMoveIndex-1).filter((move)=>move.player===MOVES.DEALER)
    const flop = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.FLOP)!==undefined
    const turn = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.TURN)!==undefined
    const river = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.RIVER)!==undefined
    spotPlayer.newSpot.spot.moves.splice(spotPlayer.newSpot.spotPlayerState.nextMoveIndex)
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
    const newSpotPlayerState = getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    extendObservable(spotPlayer.newSpot, {spotPlayerState: newSpotPlayerState})
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

  isNoRaiser(){
    const {spotPlayer} = this.props

    return  spotPlayer.newSpot.spotPlayerState && spotPlayer.newSpot.spotPlayerState.totalRaise===0
  }

  hasRaise(){
    const {spotPlayer} = this.props
    const preFlop = spotPlayer.newSpot.spot.moves.slice(0, spotPlayer.newSpot.spotPlayerState.nextMoveIndex-1).find(move=>move.action===MOVES.DEALER_ACTIONS.FLOP)===undefined

    if (spotPlayer.newSpot.spotPlayerState && spotPlayer.newSpot.spotPlayerState.totalRaise>0){
      const playerIndex = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
      const player = spotPlayer.newSpot.spotPlayerState.players[playerIndex]
      if (!player){
        return false
      }

      // if the total raise is smaller then big blind and it's pre flop
      if (preFlop&&
          spotPlayer.newSpot.spotPlayerState.totalRaise===spotPlayer.newSpot.generalSettings.bb&&
          player.bet===spotPlayer.newSpot.spotPlayerState.totalRaise){
        return false
      }
      return true
    }

    return false
  }

  canShowCards(){
    const {spotPlayer} = this.props
    if (spotPlayer.newSpot.spotPlayerState){
      const playerIndex = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
      const player = spotPlayer.newSpot.spotPlayerState.players[playerIndex]
      if (player && player.cards && player.cards[0].rank!==unimportantCard.rank){
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
        return player.bank + player.bet
      }
    }
    return 0
  }

  getMinimumRaise(){
    const {spotPlayer} = this.props
    if (spotPlayer.newSpot.spotPlayerState){
      return (spotPlayer.newSpot.spotPlayerState.totalRaise||0)+(Math.max(spotPlayer.newSpot.spotPlayerState.raiseDiff,spotPlayer.newSpot.generalSettings.bb)||0)
    }
    return 0
  }

  toggleStepsMenu(){
    const {spotPlayer} = this.props
    spotPlayer.stepsMenueOpen=!spotPlayer.stepsMenueOpen
  }

  render(){
    const {spotPlayer} = this.props
    const {step} = spotPlayer.newSpot

    return (
      <Modal open={spotPlayer.spotWizardOpen}>
        <ModalHeader>
          Spot Wizard
        </ModalHeader>

        <ModalContent className={classnames(style.spotContainer)} style={{height:'80vh'}}>
          {this.getMainContent()}
        </ModalContent>
        <ModalFooter>
          <ButtonGroup horizontal>
            <ButtonGroup horizontal noEqual>
              {step>=1&&
                <Button
                    leftIcon="back"
                    onClick={::this.previousStep}
                >
                  Back
                </Button>
              }
            </ButtonGroup>
            <ButtonGroup
                horizontal
                noEqual
                style={{justifyContent:'flex-end'}}
            >
              <Button onClick={::this.cancel}>
                Cancel
              </Button>
              <Button
                  disable={this.nextStepDisabled()}
                  onClick={::this.nextStep}
                  primary
              >
                {step===1?'Create':'Next'}
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    )
  }

}
