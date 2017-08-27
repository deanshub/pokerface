import {cardRegex} from '../../components/PostEditor/CardsPlugin/cardsRegex'
import MOVES from './constants'
import {getUnimportantCard} from '../../components/Deck/consts'

const utils = {
  getDealerIndex(players, moves){
    let dealerPlayerIndex = utils.getFirstMove(moves).player-3
    if (dealerPlayerIndex<0){
      dealerPlayerIndex = players.length + dealerPlayerIndex
    }
    return dealerPlayerIndex
  },

  getBbIndex(players, moves){
    let bbPlayerIndex = utils.getFirstMove(moves).player-1
    if (bbPlayerIndex<0){
      bbPlayerIndex = players.length + bbPlayerIndex
    }
    return bbPlayerIndex
  },

  getSbIndex(players, moves){
    let sbPlayerIndex = utils.getFirstMove(moves).player-2
    if (sbPlayerIndex<0){
      sbPlayerIndex = players.length + sbPlayerIndex
    }
    return sbPlayerIndex
  },

  getDescription(ante, isBb, isSb){
    if (isBb){
      return 'Big Blind'
    }
    if (isSb){
      return 'Small Blind'
    }
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

  getPlayersShowingCards(moves){
    let index = 0
    let stillLooking = true
    let playersShowingCards = {}

    while(stillLooking && moves.length>index){
      stillLooking = moves[index].action===MOVES.PLAYER_META_ACTIONS.SHOWS
      if (stillLooking){
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
      stillLooking = moves[index].action===MOVES.PLAYER_META_ACTIONS.SHOWS
      if (!stillLooking){
        return moves[index]
      }
      index++
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
    const {players, ante, sb, bb, currency, cards, moves } = spot
    const dealerPlayerIndex = utils.getDealerIndex(players, moves)
    const bbPlayerIndex = utils.getBbIndex(players, moves)
    const sbPlayerIndex = utils.getSbIndex(players, moves)
    const firstMove = utils.getFirstMove(moves)

    const playersShowingCards = utils.getPlayersShowingCards(moves)

    const playersState = players.map((player, index)=>{
      if (!player){
        return null
      }
      const myTurn = index === firstMove.player
      const isDealer = index === dealerPlayerIndex
      const isBb = index === bbPlayerIndex
      const isSb = index === sbPlayerIndex
      let bet = ante||0

      if (isBb){
        bet+=bb
      }
      if (isSb){
        bet+=sb
      }

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
        showCards: !!playersShowingCards[index],
        cards: playerCards,
        description: utils.getDescription(ante, isBb, isSb),
      }
    })

    return {
      nextMoveIndex: moves.indexOf(firstMove),
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

  getNextPlayer(moves, moveIndex){
    if (moves.length>moveIndex+1){
      return moves[moveIndex+1].player
    }else{
      return null
    }
    // let nextMoveIndex = moveIndex+1
    // let playerFound = false
    // while(!playerFound && moves.length>nextMoveIndex){
    //   playerFound = moves[nextMoveIndex].player!==MOVES.DEALER
    //   nextMoveIndex++
    // }
    // if (playerFound){
    //   return moves[nextMoveIndex-1].player
    // }else{
    //   return null
    // }
  },

  getNextStep(spot, currentSpotPlayerState, ereaseDescription=true){
    const move = spot.moves[currentSpotPlayerState.nextMoveIndex]
    const nextPlayer = utils.getNextPlayer(spot.moves, currentSpotPlayerState.nextMoveIndex)
    let newSpotPlayerState = Object.assign({}, currentSpotPlayerState)
    let newPlayersState = currentSpotPlayerState.players.map((player, playerIndex)=>{
      if (ereaseDescription){
        player.description=undefined
        player.myTurn=nextPlayer===playerIndex
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
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    case MOVES.PLAYER_ACTIONS.CHECK:{
      newPlayersState[move.player].description = 'Check'
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    case MOVES.PLAYER_ACTIONS.CALL:{
      newPlayersState[move.player].bet=move.value
      newPlayersState[move.player].description = 'Call'
      newSpotPlayerState.players = newPlayersState
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    case MOVES.PLAYER_ACTIONS.RAISE:{
      newPlayersState[move.player].bet=move.value
      newPlayersState[move.player].description = 'Raise'
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
    // case MOVES.PLAYER_META_ACTIONS.MOCKS:
    //   break

    case MOVES.DEALER_ACTIONS.FLOP:{
      newSpotPlayerState.dealer.cards=utils.stringToCards(move.value)
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    case MOVES.DEALER_ACTIONS.TURN:{
      newSpotPlayerState.dealer.cards=[...newSpotPlayerState.dealer.cards,...utils.stringToCards(move.value)]
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    case MOVES.DEALER_ACTIONS.RIVER:{
      newSpotPlayerState.dealer.cards=[...newSpotPlayerState.dealer.cards,...utils.stringToCards(move.value)]
      newSpotPlayerState.nextMoveIndex++
      return newSpotPlayerState
    }
    // case MOVES.DEALER_META_ACTIONS.POT:{
    // }
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

}

export default utils
