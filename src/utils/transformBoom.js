const regex = /^([^:]+): ([^ ]+) ?(.*)$/

function normalizePlayer(player){
  return {
    boomIndex: player.ps,
    bank: parseFloat(player.g.bl),
  }
}

function normalizeAction(step){
  if (step.n==='sb'){
    return {
      player: step.ps,
      action: 'SMALLBLIND',
      value: parseFloat(step.ak),
    }
  }else if (step.n==='bb'){
    return {
      player: step.ps,
      action: 'BIGBLIND',
      value: parseFloat(step.ak),
    }
  }else if (step.n==='fold'){
    return {
      player: step.ps,
      action: 'FOLD',
    }
  }else if (step.n==='check'){
    return {
      player: step.ps,
      action: 'CHECK',
    }
  }else if (step.n==='raise'){
    return {
      player: step.ps,
      action: 'RAISE',
      value: parseFloat(step.ak),
    }
  }else if (step.n==='call'){
    return {
      player: step.ps,
      action: 'CALL',
      value: parseFloat(step.ak),
    }
  }else if (step.n==='bet'){
    return {
      player: step.ps,
      action: 'BET',
      value: parseFloat(step.ak),
    }
  }else if (step.n==='showcards'){
    return {
      player: step.ps,
      action: 'SHOWS',
    }
  }
}

function normalizePlayers(boomPlayers, boom){
  let players = {}
  boomPlayers.forEach(boomPlayer=>{
    if (!players[boomPlayer.boomIndex] || !players[boomPlayer.boomIndex].bank){
      players[boomPlayer.boomIndex] = {
        bank: boomPlayer.bank,
        avatar: 'images/avatar.png',
        guest: true,
      }
    }
  })
  boom.e.filter(step=>step.n!=='sb'&&step.n!=='bb'&&step.n!=='ante').forEach((step, index, steps)=>{
    const results = regex.exec(boom.sg[index])
    if (results && !players[steps[index].ps].fullname){
      players[steps[index].ps].fullname=results[1]
    }
  })

  boom.e.filter(step=>step.n==='showcards').forEach(step=>{
    players[step.ps].cards = step.cd
  })

  // set dealer player
  let boomCd
  if (Array.isArray(boom.cd)){
    const cds = boom.cd.reduce((res,cur)=>{
      return res.concat(cur.g)
    },[])
    boomCd={g:cds}
  }else{
    boomCd=boom.cd
  }

  if (Array.isArray(boom.cs)){
    players[boom.cs[0].dp].dealer = true
  }else{
    players[boom.cs.dp].dealer = true
  }
  // show cards in front
  boomCd.g.filter(boomPlayer=>boomPlayer&&boomPlayer.cd!=='back,back').forEach((boomPlayer)=>{
    if (!players[boomPlayer.ps].cards){
      players[boomPlayer.ps].cards=boomPlayer.cd
    }
    players[boomPlayer.ps].showUpfront = true
  })

  return players
}

function findDealerActionIndexes(actions, players){
  const playersKeys = Object.keys(players)
  const playersPlayed = playersKeys.reduce((res,cur)=>{
    res[cur] = false
    return res
  },{})

  let dealerActionsIndexs = []
  actions.forEach((action, index)=>{
    if (playersKeys.filter(playerKey=>!playersPlayed[playerKey]).length===0){
      dealerActionsIndexs.push(dealerActionsIndexs.length + index)
      playersKeys.forEach(playerKey=>playersPlayed[playerKey]=false)
    }

    if (action.action==='BET'||action.action==='RAISE'){
      playersKeys.forEach(playerKey=>playersPlayed[playerKey]=false)
    }
    if (action.action==='FOLD'){
      playersKeys.splice(playersKeys.indexOf(action.player), 1)
    }

    if (action.action!=='BIGBLIND'&&action.action!=='SMALLBLIND'&&action.action!=='SHOWS'){
      playersPlayed[action.player] = true
    }
  })
  return dealerActionsIndexs
}

function immutableSplice(arr, start, deleteCount, ...items) {
  return [ ...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount) ]
}

export default function boomPlayerObjToSpot(boom){
  // console.log(boom)
  let boomBanks
  if (Array.isArray(boom.cs)){
    boomBanks = boom.cs.reduce((res,cur)=>{
      return res.concat(cur.s)
    },[])
  }else{
    boomBanks = boom.cs.s
  }

  const boomPlayers = boomBanks.filter(player=>player.o!=='free').map(normalizePlayer)
  const players = normalizePlayers(boomPlayers, boom)
  let actions = boom.e.map(normalizeAction).filter(move=>move)
  // add dealer actions
  const dealerActions = boom.r.filter(step=>step.t==='Flop'||step.t==='Turn'||step.t==='River').map(step=>{
    let value = step.cd.cm.ad.replace(/,/g,' ')
    if (!value||value===''){
      const communityCards = step.cd.cm.cd.split(',')
      if (step.t==='Flop'){
        value = communityCards.join(' ')
      }else{
        value = communityCards[communityCards.length-1]
      }
    }

    return  {
      player: 'dealer',
      action: step.t.toUpperCase(),
      value,
    }
  })

  const dealerActionsIndexs = findDealerActionIndexes(actions, players)
  dealerActions.forEach((dealerAction, index)=>{
    const pushIndex = dealerActionsIndexs[index]===undefined?actions.length:dealerActionsIndexs[index]
    actions = immutableSplice(actions, pushIndex, 0, dealerAction)
  })

  Object.keys(players).forEach(playerKey=>{
    const player = players[playerKey]
    if(player.showUpfront){
      actions.unshift({
        player: playerKey,
        action: 'SHOWS',
      })
    }
  })

  let refineCards = {}
  const refinePlayers = Object.keys(players).map((boomIndex,index)=>{
    const {cards, showUpfront, dealer, ...restPlayer} = players[boomIndex]
    if (cards){
      refineCards[index] = cards.replace(/,/g,' ')
    }
    if (dealer){
      actions.unshift({
        player: boomIndex,
        action: 'DEALER',
        showCards: showUpfront?true:false,
      })
    }
    players[boomIndex].refinedIndex = index
    return {
      ...restPlayer,
      boomIndex,
    }
  })

  const moves = actions.map(action=>{
    return {
      ...action,
      player: action.player==='dealer'?-1:players[action.player].refinedIndex,
    }
  })

  const anteStep = boom.e.find(step=>step.n==='ante')
  const ante = anteStep?parseFloat(anteStep.ak):0

  // TODO: currency:
  return {players:refinePlayers,cards:refineCards, moves, ante}
}
