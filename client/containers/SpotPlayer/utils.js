import {cardRegex} from '../../components/PostEditor/CardsPlugin/cardsRegex'
import MOVES from './constants'
import {getUnimportantCard} from '../../components/Deck/consts'

const utils = {
  getDealerIndex(players, moves){
    const moveIndex = moves.findIndex(move=>move.action===MOVES.PLAYER_META_ACTIONS.DEALER)
    return moves[moveIndex].player
  },

  getDescription(ante){
    if (ante){
      return 'Ante'
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
        description: utils.getDescription(ante),
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
    nextPlayerMoveIndex = nextMoveIndex-1

    if (nextPlayerMoveIndex>=0 && moves[nextPlayerMoveIndex].player===MOVES.DEALER){
      let nextPlayerIndex = players.findIndex(player=>player.isDealer)
      nextPlayerIndex++
      if(nextPlayerIndex>=players.length){
        nextPlayerIndex=0
      }
      while(players[nextPlayerIndex].folded){
        nextPlayerIndex++
        if(nextPlayerIndex>=players.length){
          nextPlayerIndex=0
        }
      }
      return nextPlayerIndex
    }

    while(!playerFound && nextPlayerMoveIndex>=0){
      playerFound = moves[nextPlayerMoveIndex].player!==MOVES.DEALER
      nextPlayerMoveIndex--
    }
    if (playerFound){
      let nextPlayerIndex = moves[nextPlayerMoveIndex+1].player+1
      if (nextPlayerIndex>=players.length){
        nextPlayerIndex=0
      }

      while (players[nextPlayerIndex].folded){
        nextPlayerIndex++
        if (nextPlayerIndex>=players.length){
          nextPlayerIndex=0
        }
      }

      if (currentSpotPlayerState.raiser===nextPlayerIndex){
        nextPlayerIndex = players.findIndex(player=>player.isDealer)
        nextPlayerIndex++
        if(nextPlayerIndex>=players.length){
          nextPlayerIndex=0
        }

        while(players[nextPlayerIndex].folded){
          nextPlayerIndex++
          if(nextPlayerIndex>=players.length){
            nextPlayerIndex=0
          }
        }
      }
      return nextPlayerIndex
    }else{
      return 0
    }
  },

  getNextStep(spot, currentSpotPlayerState, ereaseDescription=true){
    const move = spot.moves[currentSpotPlayerState.nextMoveIndex]
    const nextPlayer = utils.getNextPlayer(spot.moves, currentSpotPlayerState)
    let newSpotPlayerState = Object.assign({}, currentSpotPlayerState)
    let newPlayersState = currentSpotPlayerState.players.map((player, playerIndex)=>{
      player.myTurn=nextPlayer===playerIndex
      if (ereaseDescription){
        player.description=undefined
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
      newPlayersState[move.player].bet+=move.value
      newPlayersState[move.player].bank-=move.value
      newPlayersState[move.player].description = 'Call'
      newPlayersState[move.player].lastAction = 'Call'
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    case MOVES.PLAYER_ACTIONS.RAISE:{
      newPlayersState[move.player].bet+=move.value
      newPlayersState[move.player].bank-=move.value
      newSpotPlayerState.raiser = move.player
      newPlayersState[move.player].description = 'Raise'
      newPlayersState[move.player].lastAction = 'Raise'
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    case MOVES.PLAYER_ACTIONS.ANTE:{
      newSpotPlayerState.nextMoveIndex++
      // newPlayersState[move.player].description = 'Ante'
      newPlayersState[move.player].lastAction = 'Ante'
      return newSpotPlayerState
    }
    case MOVES.PLAYER_ACTIONS.SMALLBLIND:{
      newPlayersState[move.player].bet+=move.value
      newPlayersState[move.player].bank-=move.value
      newSpotPlayerState.raiser = move.player
      newPlayersState[move.player].description = 'Small Blind'
      newPlayersState[move.player].lastAction = 'Small Blind'
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    case MOVES.PLAYER_ACTIONS.BIGBLIND:{
      newPlayersState[move.player].bet+=move.value
      newPlayersState[move.player].bank-=move.value
      newSpotPlayerState.raiser = move.player
      newPlayersState[move.player].description = 'Big Blind'
      newPlayersState[move.player].lastAction = 'Big Blind'
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
        player.lastAction=undefined
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
        player.lastAction=undefined
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
        player.lastAction=undefined
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
        player.lastAction=undefined
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
      return null
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
