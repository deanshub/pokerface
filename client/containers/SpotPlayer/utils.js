import MOVES from '../../utils/game/constants'
import {stringToCards} from '../../utils/game/cards'
import {getUnimportantCard} from '../../components/Deck/consts'

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
      const bet = 0
      const bank = player.bank - bet - ante

      let playerCards = stringToCards(cards[index])
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
        pot: ante*players.length,
        cards: [],
      },
    }

    // players {username, fullname, name, bank, description ('bb'\'sb'\'ante'\...), avatar, bet, folded, myTurn, isDealer}
    // dealer {pot, cards, }
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
