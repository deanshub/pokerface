const MINIMAL_OFFSET = 10
const MINUTES_MULTIPLIER = 60 * 1000
const DEFAULT_INITIAL_ROUND ={
  ante: 10,
  smallBlind: 10,
  bigBlind: 20,
  key: Math.random(),
}

const getDefualtTimerState = () => ({
  paused:true,
  round:1,
  currentTime: Date.now(),
  offset:DEFAULT_INITIAL_ROUND.time * MINUTES_MULTIPLIER + MINIMAL_OFFSET,
  recovered:false,
  rounds:[
    {...DEFAULT_INITIAL_ROUND},
    {...DEFAULT_INITIAL_ROUND,
      key: Math.random(),
      smallBlind: 15,
      bigBlind: 30,
    },
    {...DEFAULT_INITIAL_ROUND,
      key: Math.random(),
      smallBlind: 20,
      bigBlind: 40,
    },
    {...DEFAULT_INITIAL_ROUND,
      key: Math.random(),
      smallBlind: 30,
      bigBlind: 60,
    },
    {...DEFAULT_INITIAL_ROUND,
      key: Math.random(),
      smallBlind: 50,
      bigBlind: 100,
    },
    {...DEFAULT_INITIAL_ROUND,
      key: Math.random(),
      smallBlind: 150,
      bigBlind: 300,
    },
  ]})

const getDefaultTimer = () => ({
  timerState: getDefualtTimerState(),
  userInstancesCounter: 0,
  setrecoveredTimeout: null,
  deteleTimerTimeout: null,
})

// When to delete the timer after the user goes out

// When to ask the user if he wants to reset after he goes outs and back

const onConnect = (timer) => {
  timer.userInstancesCounter++
  clearInterval(timer.deteleTimerTimeout)
  clearInterval(timer.setrecoveredTimeout)
}

const onDisconnect = (timers, userId) => {

  const timer = timers[userId]

  if (timer.userInstancesCounter > 0){
    timer.userInstancesCounter--
  }

  const {timerState} = timer

  if (timer.userInstancesCounter == 0){
    timer.setrecoveredTimeout = setTimeout(() => {
      timerState.recovered = true
    }, SET_TIMER_TO_BE_RECOVERED_DURATION)
    timer.deteleTimerTimeout = setTimeout(() => {
      timers[userId] = undefined
    }, KEEP_ALIVE_TIMER_DURATION)
  }
}

const pause = (timer, commandTime, round, offset) => {
  const {timerState} = timer

  if (!isValidateCommand(timer, commandTime)){
    console.log('Async error in pause')
  }else{
    clearInterval(timer.nextRountTimeout)
    timer.timerState = {...timerState, paused:true, currentTime:commandTime, offset, round}
  }

  return timer.timerState
}

const resume = (timer, commandTime, round, endTime) => {

  if (!isValidateCommand(timer, commandTime)){
    console.log('Async error in resume')
  }else{
    clearInterval(timer.nextRountTimeout)

    timer.timerState = {...timer.timerState, paused:false, currentTime:commandTime, endTime, round}
    timer.nextRountTimeout = setTimeout(() => nextRound(timer), endTime-commandTime)
  }
  return timer.timerState
}

// It is static data so meanwhile no time validation
const updateTimerRounds = (timer, commandTime, rounds) => {
  const {timerState} = timer

  timerState.rounds = rounds
  timerState.current = commandTime

  return timer.timerState
}

const updateRound = (timer, commandTime, round, paused, endTime) => {
  const {timerState} = timer

  if (!isValidateCommand(timer, commandTime)){
    console.log('Async error in nextRound')
  }else{
    clearInterval(timer.nextRountTimeout)

    timerState.round = round
    timerState.paused = paused
    timerState.currentTime = commandTime

    // If the round number is greater then the rounds array we take the last one.
    const roundIndex = Math.min(round, timerState.rounds.length-1)
    const roundDuration = timerState.rounds[roundIndex].time * MINUTES_MULTIPLIER + MINIMAL_OFFSET
    if (paused){
      timerState.offset = roundDuration
    }else{
      timerState.nextRountTimeout = setTimeout(() => nextRound(timer), roundDuration)
    }
    timerState.endTime = endTime
  }

  return timerState
}

const setResetClientResponse = (timer, commandTime, reset) => {
  if (!isValidateCommand(timer, commandTime)){
    console.log('Async error in setResetClientResponse')
  }else{

    if (reset){
      clearInterval(timer.nextRountTimeout)
      timer.timerState = getDefualtTimerState()
    }
    timer.timerState.currentTime = commandTime
    timer.timerState.recovered = false
  }

  return timer.timerState
}

const nextRound = (timer) => {
  const {timerState} = timer

  timerState.round++

  // If the round number is greater then the rounds array we take the last one.
  const roundIndex = Math.min(timerState.round, timerState.rounds.length-1)

  const roundDuration = timerState.rounds[roundIndex].time * MINUTES_MULTIPLIER + MINIMAL_OFFSET
  timer.nextRountTimeout = setTimeout(() => nextRound(timer), roundDuration)

  const currentTime = Date.now()
  timerState.endTime = currentTime + roundDuration
}

const isValidateCommand = (timer, commandTime) => {
  return (commandTime > timer.timerState.currentTime)
}

const timers = {}

export const timerActions = {
  getTimer(userId){

    if (!timers[userId]){
      timers[userId] = getDefaultTimer()
    }

    return timers[userId].timerState
  },
  pause(userId, commandTime, round, offset){
    return pause(timers[userId], commandTime, round, offset)
  },
  resume(userId, commandTime, round, endTime){
    return resume(timers[userId], commandTime, round, endTime)
  },
  updateRound(userId, commandTime, round, paused, endTime){
    return updateRound(timers[userId], commandTime, round, paused, endTime)
  },
  updateTimerRounds(userId, commandTime, rounds){
    return updateTimerRounds(timers[userId], commandTime, rounds)
  },
  setResetClientResponse(userId, commandTime, reset){
    return setResetClientResponse(timers[userId], commandTime, reset)
  },
}

export const eventConnectionListener = {
  onConnect(userId){
    if (!timers[userId]){
      timers[userId] = getDefaultTimer()
    }
    onConnect(timers[userId])
  },
  onDisconnect(userId){
    onDisconnect(timers, userId)
  },
}
