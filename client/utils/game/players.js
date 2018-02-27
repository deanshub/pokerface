import MOVES from './constants'

export function getNextPlayer(moves, currentSpotPlayerState){
  const {nextMoveIndex, players} = currentSpotPlayerState

  // let nextPlayerMoveIndex = nextMoveIndex
  // let playerFound = false
  // while(!playerFound && moves.length>nextPlayerMoveIndex){
  //   playerFound = moves[nextPlayerMoveIndex].player!==MOVES.DEALER
  //   nextPlayerMoveIndex++
  // }
  // if (playerFound){
  //   return moves[nextPlayerMoveIndex-1].player
  // }

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
  while (moveIndex<nextMoveIndex && moves[moveIndex]){
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
}
