export const SELECTED = 'selected'
export const SUGGEST_CLOSE = 'suggestClose'
export const SUGGEST_FAR = 'suggestFar'

export const getNighborsXY=(x,y)=>{
  return [
    {x,y:y-1},
    {x:x+1,y:y-1},
    {x:x+1,y},
    {x,y:y+1},
    {x:x-1,y:y+1},
    {x:x-1,y},
  ]
}

export const isSuggestedClose=({x:x1,y:y1},{x:x2,y:y2})=>{
  const nighbors= getNighborsXY(x1,y1).reduce((res, cur)=>{
    res[`${cur.x}${cur.y}`]=true
    return res
  },{})

  return nighbors[`${x2}${y2}`]===true
}

export const isSuggested = ({x:x1,y:y1}, {x:x2,y:y2})=>{
  if(x1===x2 && y1===y2){
    return SELECTED
  }else if (isSuggestedClose({x:x1,y:y1}, {x:x2,y:y2})){
    return SUGGEST_CLOSE
  }else{
    const farNighbor = getNighborsXY(x1,y1).filter(point=>{
      return isSuggestedClose(point,{x:x2,y:y2})
    })
    if (farNighbor.length>0){
      return SUGGEST_FAR
    }
  }
}

export const putPawn = (board, {x,y}, pawnData)=>{
  const oldColumn = board[x]
  const newColumn = [
    ...oldColumn.slice(0, y),
    pawnData,
    ...oldColumn.slice(y+1),
  ]
  const newBoard = [
    ...board.slice(0, x),
    newColumn,
    ...board.slice(x+1),
  ]
  return newBoard
}

export const duplicatePawn = (board, {x,y}, pawnData)=>{
  let newBoard = putPawn(board, {x,y}, pawnData)

  getNighborsXY(x,y).filter(point=>{
    return (newBoard[point.x]&&newBoard[point.x][point.y]&& newBoard[point.x][point.y].player!==0&&newBoard[point.x][point.y]!==pawnData.player)
  }).forEach(point=>{
    newBoard = putPawn(newBoard, point, pawnData)
  })

  return newBoard
}

export const movePawn = (board, {x:xDest, y:yDest}, pawnData, {x:xSource,y:ySource})=>{
  const oldColumnSource = board[xSource]
  const newColumnSource = [
    ...oldColumnSource.slice(0, ySource),
    {player:0},
    ...oldColumnSource.slice(ySource+1),
  ]
  const boardWithoutSource = [
    ...board.slice(0, xSource),
    newColumnSource,
    ...board.slice(xSource+1),
  ]

  return duplicatePawn(boardWithoutSource, {x:xDest,y: yDest}, pawnData)
}

export const getPossibleMoves = (board, player)=>{
  let playersPosition = []
  board.forEach((col, x)=>{
    col.forEach((cell, y)=>{
      if (cell && cell.player===player){
        playersPosition.push({x,y})
      }
    })
  })

  const possibleMovesClose = playersPosition.map(pos=>{
    const neighbors = getNighborsXY(pos.x, pos.y)
    return neighbors.filter(pos=>board[pos.x]&&board[pos.x][pos.y]&&board[pos.x][pos.y].player===0).map(posClose=>{
      posClose.origin = pos
      return posClose
    })
  }).reduce((a,b)=>{
    return a.concat(b)
  },[]).map(pos=>{
    const neighbors = getNighborsXY(pos.x, pos.y)
    return neighbors.filter(pos=>board[pos.x]&&board[pos.x][pos.y]&&board[pos.x][pos.y].player===0).map(posFar=>{
      posFar.origin= pos.origin
      return posFar
    })
  }).reduce((a,b)=>{
    return a.concat(b)
  },[]).reduce((res,pos)=>{
    if (res[pos.x] === undefined){
      res[pos.x]={}
    }
    if (res[pos.x][pos.y] === undefined){
      res[pos.x][pos.y]=[]
    }

    if (!res[pos.x][pos.y].includes(pos.origin)){
      res[pos.x][pos.y].push(pos.origin)
    }

    return res
  },{})

  let possibleMovesArr = []
  for (let x in possibleMovesClose){
    for (let y in possibleMovesClose[x]){
      const differentOrigin = possibleMovesClose[x][y].map(point=>{
        return {from:point ,to:{x:parseInt(x),y:parseInt(y)}}
      })
      possibleMovesArr = possibleMovesArr.concat(differentOrigin)
    }
  }
  console.log(possibleMovesArr);
}
