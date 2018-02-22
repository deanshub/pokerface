// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
// import PropTypes from 'prop-types'
import MOVES from '../../utils/game/constants'
import Image from '../basic/Image'
import Button from '../basic/Button'
import Cards from '../Deck/Cards'
import classnames from 'classnames'
import style from './stepsMenuStyle.css'
import {stringToCards} from '../../utils/game/cards'

@inject('spotPlayer')
@observer
export default class StepsMenu extends Component {
  generateImage(player,step){
    if (player){
      return (
        <Image
            avatar
            className={classnames(style.image)}
            src={player.avatar}
        />
      )
    }else if (step.action===MOVES.DEALER_ACTIONS.FLOP||
        step.action===MOVES.DEALER_ACTIONS.TURN||
        step.action===MOVES.DEALER_ACTIONS.RIVER){
      return (
        <Cards
            cards={stringToCards(step.value)}
            dealer
            noHoverEffect
            style={{height:'4em'}}
        />
      )
    }
    return null
  }
  generateIcon(step){
    if (step.action===MOVES.PLAYER_META_ACTIONS.SHOWS) {
      return (
        <Button disable leftIcon="show"/>
      )
    }else if (step.action===MOVES.PLAYER_ACTIONS.FOLD) {
      return (
        <Button disable leftIcon="fold"/>
      )
    }else if (step.action===MOVES.PLAYER_ACTIONS.CHECK) {
      return (
        <Button disable leftIcon="check"/>
      )
    }else if (step.action===MOVES.PLAYER_ACTIONS.CALL) {
      return (
        <Button disable leftIcon="call"/>
      )
    }else if (step.action===MOVES.PLAYER_ACTIONS.RAISE) {
      return (
        <Button disable leftIcon="raise"/>
      )
    }else if (step.action===MOVES.PLAYER_ACTIONS.BET) {
      return (
        <Button disable leftIcon="raise"/>
      )
    }else{
      return null
    }
  }
  generateLabel(player,step){
    if (step.action===MOVES.DEALER_ACTIONS.FLOP){
      return (<div className={classnames(style.label, style.bold)}>FLOP</div>)
    }else if (step.action===MOVES.DEALER_ACTIONS.TURN) {
      return (<div className={classnames(style.label, style.bold)}>TURN</div>)
    }else if (step.action===MOVES.DEALER_ACTIONS.RIVER) {
      return (<div className={classnames(style.label, style.bold)}>RIVER</div>)
    }else if (step.action===MOVES.PLAYER_META_ACTIONS.SHOWS) {
      return (
        <React.Fragment>
          <div className={classnames(style.label, style.name)}>{player.fullname}</div>
          <div className={classnames(style.label)}>Shows Cards</div>
        </React.Fragment>
      )
    }else if (step.action===MOVES.PLAYER_ACTIONS.FOLD) {
      return (
        <React.Fragment>
          <div className={classnames(style.label, style.name)}>{player.fullname}</div>
          <div className={classnames(style.label)}>Fold</div>
        </React.Fragment>
      )
    }else if (step.action===MOVES.PLAYER_ACTIONS.CHECK) {
      return (
        <React.Fragment>
          <div className={classnames(style.label, style.name)}>{player.fullname}</div>
          <div className={classnames(style.label)}>CHECK</div>
        </React.Fragment>
      )
    }else if (step.action===MOVES.PLAYER_ACTIONS.CALL) {
      return (
        <React.Fragment>
          <div className={classnames(style.label, style.name)}>{player.fullname}</div>
          <div className={classnames(style.label)}>Call ${step.value}</div>
        </React.Fragment>
      )
    }else if (step.action===MOVES.PLAYER_ACTIONS.RAISE) {
      return (
        <React.Fragment>
          <div className={classnames(style.label, style.name)}>{player.fullname}</div>
          <div className={classnames(style.label)}>Raise ${step.value}</div>
        </React.Fragment>
      )
    }else if (step.action===MOVES.PLAYER_ACTIONS.BET) {
      return (
        <React.Fragment>
          <div className={classnames(style.label, style.name)}>{player.fullname}</div>
          <div className={classnames(style.label)}>Bet ${step.value}</div>
        </React.Fragment>
      )
    }
  }

  buildStep(step, stepIndex){
    const {spotPlayer} = this.props
    const player = spotPlayer.newSpot.spot.players[step.player]
    if (step.section){
      return (
        <div className={classnames(style.step, style.sectionLabel)} key={stepIndex}>
          {step.section}
        </div>
      )
    }else{
      return (
        <div className={classnames(style.step)} key={stepIndex}>
          {this.generateImage(player,step)}
          <div className={classnames(style.labels)}>
            {this.generateLabel(player,step)}
          </div>
          <div className={classnames(style.icon)}>
            {this.generateIcon(step)}
          </div>
        </div>
      )
    }
  }

  addLabels(moves){
    const dealerMoves = moves.filter((move)=>move.player===MOVES.DEALER)
    const flop = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.FLOP)
    const turn = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.TURN)
    const river = dealerMoves.find(move=>move.action===MOVES.DEALER_ACTIONS.RIVER)
    let labeledMoves = [...moves]

    labeledMoves.splice(0,0,{section:'Pre-Flop'})

    if(flop){
      const flopIndex = labeledMoves.indexOf(flop)
      labeledMoves.splice(flopIndex,0,{section:'Flop'})
    }
    if(turn){
      const turnIndex = labeledMoves.indexOf(turn)
      labeledMoves.splice(turnIndex,0,{section:'Turn'})
    }
    if(river){
      const riverIndex = labeledMoves.indexOf(river)
      labeledMoves.splice(riverIndex,0,{section:'River'})
    }
    return labeledMoves
  }

  render(){
    const {spotPlayer} = this.props
    const moves = spotPlayer.newSpot.spot.moves.filter(move=>move.action!==MOVES.PLAYER_META_ACTIONS.DEALER&&
      move.action!==MOVES.PLAYER_ACTIONS.ANTE&&
      move.action!==MOVES.PLAYER_ACTIONS.SMALLBLIND&&
      move.action!==MOVES.PLAYER_ACTIONS.BIGBLIND
    )
    return (
      <div className={classnames(style.stepsMenu)} style={{width:spotPlayer.stepsMenueOpen?undefined:0}}>
        {
          moves.length>0?
          this.addLabels(moves).map(::this.buildStep)
          :
          <div className={classnames(style.noSteps)}>No Play History</div>
        }
      </div>
    )
  }
}
