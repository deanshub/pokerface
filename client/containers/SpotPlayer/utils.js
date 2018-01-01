import {cardRegex} from '../../components/PostEditor/CardsPlugin/cardsRegex'
import MOVES from './constants'
import {getUnimportantCard} from '../../components/Deck/consts'
import { observable, extendObservable } from 'mobx'

const utils = {
  getDealerIndex(players, moves){
    const moveIndex = moves.findIndex(move=>move.action===MOVES.PLAYER_META_ACTIONS.DEALER)
    return moves[moveIndex].player
  },

  getDescription(ante){
    if (ante){
      return 'ANTE'
    }
  },

  stringToCards(cardsString){
    let cards = []
    let matchArr
    while ((matchArr = cardRegex.exec(cardsString)) !== null) {
      cards.push({
        rank: matchArr[2],
        suit: matchArr[3],
      })
    }
    return cards
  },

  stillLooking(action){
    return (
      action===MOVES.PLAYER_META_ACTIONS.SHOWS ||
      action===MOVES.PLAYER_META_ACTIONS.DEALER ||
      action===MOVES.PLAYER_ACTIONS.ANTE
    )
  },

  getPlayersShowingCards(moves){
    let index = 0
    let stillLooking = true
    let playersShowingCards = {}

    while(stillLooking && moves.length>index){
      stillLooking = this.stillLooking(moves[index].action)
      if (moves[index].action===MOVES.PLAYER_META_ACTIONS.SHOWS){
        playersShowingCards[moves[index].player]=true
      }
      index++
    }
    return playersShowingCards
  },

  getFirstMove(moves){
    let index = 0
    let stillLooking = true

    while(stillLooking && moves.length>index){
      stillLooking = this.stillLooking(moves[index].action)
      if (!stillLooking){
        return moves[index]
      }
      index++
    }
    if (moves.length>0){
      return moves[moves.length-1]
    }
    return null
  },

  getCoveredCards(number){
    const cards = Array.from(Array(number)).map(()=>{
      return getUnimportantCard()
    })
    return cards
  },

  generateInitialState(spot){
    if (spot === undefined) return undefined

    const {players, ante, currency, cards={}, moves } = spot
    const dealerPlayerIndex = utils.getDealerIndex(players, moves)
    const firstMove = utils.getFirstMove(moves)

    const playersShowingCards = utils.getPlayersShowingCards(moves)

    const playersState = players.map((player, index)=>{
      if (!player){
        return null
      }
      const myTurn = index === firstMove.player
      const isDealer = index === dealerPlayerIndex
      const bet = ante||0
      const bank = player.bank - bet

      let playerCards = utils.stringToCards(cards[index])
      if (playerCards.length===0){
        playerCards=utils.getCoveredCards(2)
      }

      return {
        folded: false,
        ...player,
        myTurn,
        isDealer,
        bet,
        bank,
        showCards: !!playersShowingCards[index],
        cards: playerCards,
        // description: utils.getDescription(ante),
        lastAction: utils.getDescription(ante),
      }
    })

    let nextMoveIndex = moves.indexOf(firstMove)
    if (firstMove.action===MOVES.PLAYER_META_ACTIONS.DEALER){
      nextMoveIndex++
    }

    return {
      nextMoveIndex,
      players: playersState,
      currency,
      dealer:{
        pot: 0,
        cards: [],
      },
    }

    // players {username, fullname, name, bank, description ('bb'\'sb'\'ante'\...), avatar, bet, folded, myTurn, isDealer}
    // dealer {pot, cards, }
  },

  getNextPlayer(moves, currentSpotPlayerState){
    const {nextMoveIndex, players} = currentSpotPlayerState

    let nextPlayerMoveIndex = nextMoveIndex+1
    let playerFound = false
    while(!playerFound && moves.length>nextPlayerMoveIndex){
      playerFound = moves[nextPlayerMoveIndex].player!==MOVES.DEALER
      nextPlayerMoveIndex++
    }
    if (playerFound){
      return moves[nextPlayerMoveIndex-1].player
    }

    // if there are no future moves
    const playerDealerMove = moves.find(move=>move.action===MOVES.PLAYER_META_ACTIONS.DEALER)
    const dealerPlayerIndex = playerDealerMove?playerDealerMove.player:0
    let playersKeys = []
    let index = dealerPlayerIndex+1
    while (index<players.length){
      playersKeys.push(index)
      index++
    }
    index = 0
    while (index<=dealerPlayerIndex){
      playersKeys.push(index)
      index++
    }

    const playersPlayed = playersKeys.reduce((res,cur)=>{
      res[cur] = false
      return res
    },{})

    let moveIndex = 0
    let lastPlayerPlayedIndex
    let move
    while (moveIndex<=nextMoveIndex && moves[moveIndex]){
      move = moves[moveIndex]

      if (move.action!==MOVES.PLAYER_META_ACTIONS.SHOWS&&
          move.action!==MOVES.PLAYER_META_ACTIONS.DEALER&&
          move.player!==MOVES.DEALER){
        lastPlayerPlayedIndex = playersKeys.indexOf(move.player)
      }

      if (move.action===MOVES.PLAYER_ACTIONS.RAISE||move.action===MOVES.PLAYER_ACTIONS.BET||move.player===MOVES.DEALER){
        playersKeys.forEach(playerKey=>playersPlayed[playerKey]=false)
      }
      if (move.action===MOVES.PLAYER_ACTIONS.FOLD){
        lastPlayerPlayedIndex--
        playersKeys.splice(playersKeys.indexOf(move.player), 1)
      }

      if (move.action!==MOVES.PLAYER_ACTIONS.BIGBLIND&&
          move.action!==MOVES.PLAYER_ACTIONS.SMALLBLIND&&
          move.action!==MOVES.PLAYER_META_ACTIONS.SHOWS&&
          move.action!==MOVES.PLAYER_META_ACTIONS.DEALER&&
          move.player!==MOVES.DEALER){
        playersPlayed[move.player] = true
      }

      moveIndex++
    }

    const allPlayed = playersKeys.filter(playerKey=>playersPlayed[playerKey]).length===playersKeys.length

    if((move)&&(move.action===MOVES.PLAYER_ACTIONS.BIGBLIND||move.action===MOVES.PLAYER_ACTIONS.SMALLBLIND)){
      const lastPlayerIndex = move.player
      const keyIndexOfLastPlayer = playersKeys.findIndex(playerKey=>playerKey===lastPlayerIndex)
      if(playersKeys.length===keyIndexOfLastPlayer+1){
        return playersKeys[0]
      }else{
        return playersKeys[keyIndexOfLastPlayer+1]
      }
    }


    const riverShowed = moves.find(move=>move.action===MOVES.DEALER_ACTIONS.RIVER)
    if((allPlayed && riverShowed) || playersKeys.length<=1){
      return null
    }else if(allPlayed){
      return MOVES.DEALER
    }else{
      if (lastPlayerPlayedIndex===undefined||lastPlayerPlayedIndex+1>=playersKeys.length||move.player===MOVES.DEALER){
        return playersKeys[0]
      }else{
        return playersKeys[lastPlayerPlayedIndex+1]
      }
    }
  },

  getNextStep(spot, currentSpotPlayerState, ereaseDescription=true){
    const move = spot.moves[currentSpotPlayerState.nextMoveIndex]
    const nextPlayer = utils.getNextPlayer(spot.moves, currentSpotPlayerState)
    let newSpotPlayerState = observable(Object.assign({}, currentSpotPlayerState))
    let newPlayersState = currentSpotPlayerState.players.map((player, playerIndex)=>{
      player.myTurn=nextPlayer===playerIndex
      if (ereaseDescription){
        extendObservable(player,{description:null})
      }
      return player
    })
    if(move===undefined){
      newSpotPlayerState.players = newPlayersState
      return newSpotPlayerState
    }

    switch(move.action){
    case MOVES.PLAYER_ACTIONS.FOLD:{
      newPlayersState[move.player].folded=true
      newPlayersState[move.player].description = 'Fold'
      newPlayersState[move.player].lastAction = 'Fold'
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    case MOVES.PLAYER_ACTIONS.CHECK:{
      newPlayersState[move.player].description = 'Check'
      newPlayersState[move.player].lastAction = 'Check'
      if (newSpotPlayerState.raiser===undefined){
        newSpotPlayerState.raiser = move.player
      }
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
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
      return newSpotPlayerState
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
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
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
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
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
      return newSpotPlayerState
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
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
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
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }

    case MOVES.PLAYER_META_ACTIONS.SHOWS:{
      newPlayersState[move.player].showCards=true
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.nextMoveIndex++
      return utils.getNextStep(spot, newSpotPlayerState, false)
    }
    case MOVES.PLAYER_META_ACTIONS.DEALER:{
      newSpotPlayerState.nextMoveIndex++
      return utils.getNextStep(spot, newSpotPlayerState, false)
    }
    // case MOVES.PLAYER_META_ACTIONS.MOCKS:
    //   break

    case MOVES.DEALER_ACTIONS.FLOP:{
      newSpotPlayerState.dealer.cards=utils.stringToCards(move.value)
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
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    case MOVES.DEALER_ACTIONS.TURN:{
      newSpotPlayerState.dealer.cards=[...newSpotPlayerState.dealer.cards,...utils.stringToCards(move.value)]
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
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    case MOVES.DEALER_ACTIONS.RIVER:{
      newSpotPlayerState.dealer.cards=[...newSpotPlayerState.dealer.cards,...utils.stringToCards(move.value)]
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
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
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
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    }
  },

  getPreviousStep(spot, currentSpotPlayerState){
    // currentSpotPlayerState.nextMoveIndex
    console.log('getPreviousStep');
    return currentSpotPlayerState
  },

  amountToCoins(amount, coins) {
    // if (cache[amount]!==undefined){
    //   return cache[amount];
    // }

    if (amount === 0) {
      return []
    }else if (coins.length===0) {
      return []
    }else {
      const currentCoin = coins[0]
      if (amount >= currentCoin) {
        const left = (amount - currentCoin)
        const restOfCoins = utils.amountToCoins(left, coins)

        if (restOfCoins===null){
          return null
        }

        // return cache[amount] = [currentCoin, ...restOfCoins];
        return [currentCoin, ...restOfCoins]
      }else {
        coins.shift()
        return utils.amountToCoins(amount, coins)
      }
    }
  },

  getCurrentTurnPlayerIndex(currentSpotPlayerState){
    return currentSpotPlayerState.players.findIndex(player=>player.myTurn)
  },

}

export default utils
