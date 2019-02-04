import { observable, extendObservable } from 'mobx'
import MOVES from './constants'
import {getNextPlayer} from './players'
import {stringToCards} from './cards'
import utils from '../../containers/SpotPlayer/utils'

export function getNextStep(spot, currentSpotPlayerState, ereaseDescription=true){
  const move = spot.moves[currentSpotPlayerState.nextMoveIndex]
  let returnedState
  let newSpotPlayerState = observable(Object.assign({}, currentSpotPlayerState))
  let newPlayersState = currentSpotPlayerState.players.map((player, playerIndex)=>{
    if (ereaseDescription){
      extendObservable(player,{description:null})
    }
    return player
  })
  if(move===undefined){
    newSpotPlayerState.players = newPlayersState
    returnedState = newSpotPlayerState
  }

  if (move!==undefined){
    switch(move.action){
    case MOVES.PLAYER_ACTIONS.FOLD:{
      newPlayersState[move.player].folded=true
      newPlayersState[move.player].description = 'Fold'
      newPlayersState[move.player].lastAction = 'Fold'
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }
    case MOVES.PLAYER_ACTIONS.CHECK:{
      newPlayersState[move.player].description = 'Check'
      newPlayersState[move.player].lastAction = 'Check'
      if (newSpotPlayerState.raiser===undefined){
        newSpotPlayerState.raiser = move.player
      }
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }
    case MOVES.PLAYER_ACTIONS.CALL:{
      if (newPlayersState[move.player].bank<=move.value){
        newPlayersState[move.player].bet += newPlayersState[move.player].bank
        newPlayersState[move.player].bank = 0
        newPlayersState[move.player].description = 'All-in'
        newPlayersState[move.player].lastAction = 'All-in'
      }else{
        newPlayersState[move.player].bet+=move.value
        newPlayersState[move.player].bank-=move.value
        newPlayersState[move.player].description = 'Call'
        newPlayersState[move.player].lastAction = 'Call'
      }

      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }
    case MOVES.PLAYER_ACTIONS.BET:{
      if (newPlayersState[move.player].bank<=move.value){
        newPlayersState[move.player].bet += newPlayersState[move.player].bank
        newPlayersState[move.player].bank = 0
        newPlayersState[move.player].description = 'All-in'
        newPlayersState[move.player].lastAction = 'All-in'
      }else{
        newPlayersState[move.player].bet+=move.value
        newPlayersState[move.player].bank-=move.value
        newPlayersState[move.player].description = 'Bet'
        newPlayersState[move.player].lastAction = 'Bet'
      }
      newSpotPlayerState.raiser = move.player
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.totalRaise = Math.max(move.value, newSpotPlayerState.totalRaise)
      newSpotPlayerState.raiseDiff = Math.max(move.value - newSpotPlayerState.totalRaise, newSpotPlayerState.raiseDiff)
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }
    case MOVES.PLAYER_ACTIONS.RAISE:{
      if (newPlayersState[move.player].bank<=move.value){
        newPlayersState[move.player].bet += newPlayersState[move.player].bank
        newPlayersState[move.player].bank = 0
        newPlayersState[move.player].description = 'All-in'
        newPlayersState[move.player].lastAction = 'All-in'
      }else{
        newPlayersState[move.player].bet+=move.value
        newPlayersState[move.player].bank-=move.value
        newPlayersState[move.player].description = 'Raise'
        newPlayersState[move.player].lastAction = 'Raise'
      }
      newSpotPlayerState.raiser = move.player
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.totalRaise = Math.max(newPlayersState[move.player].bet, newSpotPlayerState.totalRaise)
      newSpotPlayerState.raiseDiff = Math.max(move.value - newSpotPlayerState.totalRaise, newSpotPlayerState.raiseDiff)
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }
    case MOVES.PLAYER_ACTIONS.ANTE:{
      if (newPlayersState[move.player].bank==0){
        // newPlayersState[move.player].description = 'All-in'
        newPlayersState[move.player].lastAction = 'All-in'
      }else{
        // newPlayersState[move.player].description = 'Ante'
        newPlayersState[move.player].lastAction = 'Ante'
      }
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }
    case MOVES.PLAYER_ACTIONS.SMALLBLIND:{
      if (newPlayersState[move.player].bank<=move.value){
        newPlayersState[move.player].bet += newPlayersState[move.player].bank
        newPlayersState[move.player].bank = 0
        newPlayersState[move.player].description = 'All-in'
        newPlayersState[move.player].lastAction = 'All-in'
      }else{
        newPlayersState[move.player].bet+=move.value
        newPlayersState[move.player].bank-=move.value
        newPlayersState[move.player].description = 'Small Blind'
        newPlayersState[move.player].lastAction = 'Small Blind'
      }
      newSpotPlayerState.raiser = move.player
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.totalRaise = move.value
      newSpotPlayerState.raiseDiff = move.value
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }
    case MOVES.PLAYER_ACTIONS.BIGBLIND:{
      if (newPlayersState[move.player].bank<=move.value){
        newPlayersState[move.player].bet += newPlayersState[move.player].bank
        newPlayersState[move.player].bank = 0
        newPlayersState[move.player].description = 'All-in'
        newPlayersState[move.player].lastAction = 'All-in'
      }else{
        newPlayersState[move.player].bet+=move.value
        newPlayersState[move.player].bank-=move.value
        newPlayersState[move.player].description = 'Big Blind'
        newPlayersState[move.player].lastAction = 'Big Blind'
      }
      newSpotPlayerState.raiser = move.player
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.totalRaise = move.value
      newSpotPlayerState.raiseDiff = move.value
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }

    case MOVES.PLAYER_META_ACTIONS.SHOWS:{
      newPlayersState[move.player].showCards=true
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.nextMoveIndex++
      return getNextStep(spot, newSpotPlayerState, false)
    }
    case MOVES.PLAYER_META_ACTIONS.DEALER:{
      newSpotPlayerState.nextMoveIndex++
      newSpotPlayerState.totalRaise = 0
      newSpotPlayerState.raiseDiff = 0
      return getNextStep(spot, newSpotPlayerState, false)
    }
    // case MOVES.PLAYER_META_ACTIONS.MOCKS:
    //   break
    case MOVES.DEALER_ACTIONS.FLOP:{
      newSpotPlayerState.dealer.cards=stringToCards(move.value)
      let totalPot = newSpotPlayerState.dealer.pot
      newPlayersState.forEach(player=>{
        player.lastAction=null
        extendObservable(player,{description:null})
        totalPot += player.bet
        player.bet = 0
      })
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.dealer.pot = totalPot
      newSpotPlayerState.raiser = undefined
      newSpotPlayerState.totalRaise = 0
      newSpotPlayerState.raiseDiff = 0
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }
    case MOVES.DEALER_ACTIONS.TURN:{
      newSpotPlayerState.dealer.cards=[...newSpotPlayerState.dealer.cards,...stringToCards(move.value)]
      let totalPot = newSpotPlayerState.dealer.pot
      newPlayersState.forEach(player=>{
        player.lastAction=null
        extendObservable(player,{description:null})
        totalPot += player.bet
        player.bet = 0
      })
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.dealer.pot = totalPot
      newSpotPlayerState.raiser = undefined
      newSpotPlayerState.totalRaise = 0
      newSpotPlayerState.raiseDiff = 0
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }
    case MOVES.DEALER_ACTIONS.RIVER:{
      newSpotPlayerState.dealer.cards=[...newSpotPlayerState.dealer.cards,...stringToCards(move.value)]
      let totalPot = newSpotPlayerState.dealer.pot
      newPlayersState.forEach(player=>{
        player.lastAction=null
        extendObservable(player,{description:null})
        totalPot += player.bet
        player.bet = 0
      })
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.dealer.pot = totalPot
      newSpotPlayerState.raiser = undefined
      newSpotPlayerState.totalRaise = 0
      newSpotPlayerState.raiseDiff = 0
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }
    case MOVES.DEALER_META_ACTIONS.END:{
      let totalPot = newSpotPlayerState.dealer.pot
      newPlayersState.forEach(player=>{
        player.lastAction=null
        extendObservable(player,{description:null})
        totalPot += player.bet
        player.bet = 0
      })
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.dealer.pot = totalPot
      newSpotPlayerState.raiser = undefined
      newSpotPlayerState.totalRaise = 0
      newSpotPlayerState.raiseDiff = 0
      newSpotPlayerState.nextMoveIndex++
      returnedState = newSpotPlayerState
      break
    }
    }
  }

  if (returnedState){
    const nextPlayer = getNextPlayer(spot.moves, returnedState)
    returnedState.players = returnedState.players.map((player, playerIndex)=>{
      player.myTurn=nextPlayer===playerIndex
      return player
    })
  }
  return returnedState
}

export function getNextSteps(spot, originalSpotPlayerState, stepsForward=1){
  let currentState = originalSpotPlayerState
  let previousState = originalSpotPlayerState
  let nextMoveIndex = 0
  while(currentState.nextMoveIndex<originalSpotPlayerState.nextMoveIndex+stepsForward && nextMoveIndex!==previousState.nextMoveIndex){
    previousState = currentState
    currentState = getNextStep(spot, currentState)
    nextMoveIndex = currentState.nextMoveIndex
  }
  return currentState
}

export function getPreviousStep(spot, originalSpotPlayerState, stepsBack=1){
  let currentState = utils.generateInitialState(spot)
  let previousState = currentState
  while(currentState.nextMoveIndex<originalSpotPlayerState.nextMoveIndex-stepsBack){
    previousState = currentState
    currentState = getNextStep(spot, currentState)
  }
  if (currentState.nextMoveIndex<originalSpotPlayerState.nextMoveIndex){
    return currentState
  }else{
    return previousState
  }
}
