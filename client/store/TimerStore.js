import { observable, action, computed } from 'mobx'
import graphqlClient from './graphqlClient'
import { timerQuery } from './queries/timers'
import {
  timerPause,
  timerResume,
  timerUpdateRound,
  timerRoundsUpdate,
  timerResetResponseSetting,
} from './mutations/timers'
import { timerChanged } from './subscriptions/timers'
import {fillBlinds} from './blindsUtils/utils'
import debounce from '../utils/debounce'

export class TimerStore {
  @observable rounds

  @observable currentTime
  @observable endTime
  @observable offset
  @observable round
  @observable paused
  @observable settingsModalOpen
  @observable inverted
  @observable settingsModalMountNode
  @observable resetModalMountNode
  @observable recovered
  @observable loading
  @observable autoUpdateBlinds

  MINIMAL_OFFSET = 10
  MINUTES_MULTIPLIER = 60 * 1000
  TIMER_INTERVAL = 100
  DEFAULT_INITIAL_ROUND = {
    ante: 0,
    smallBlind: 2,
    bigBlind: 4,
    time: 15,
  }

  constructor(){
    this.settingsModalOpen = false
    this.inverted = false
    this.settingsModalMountNode = undefined
    this.resetModalMountNode = undefined
    this.loading = true
    this.blindsSound = new Audio(require('../assets/10.mp3'))
    this.autoUpdateBlinds = true
    this.rounds = [this.DEFAULT_INITIAL_ROUND]
    this.paused = true
    this.offset = 0

    // The subscription is lazy.
    this.subscribed = false

    this.debouncedMutateRounds  = debounce(this.mutateRounds, 300)
  }

  @action startSubscription(){
    if (!this.subscribed){
      this.subscriptionObserver = graphqlClient.subscribe({
        query:timerChanged,
      })

      this.subscriptionObserver.subscribe({
        next:({timerChanged})=>{
          // console.log('receive timer:', timerChanged)
          if (timerChanged.currentTime !== null){
            this.setTimer(timerChanged)
          }
        },
      })

      this.subscribed = true
      this.fetchTimer()
    }
  }

  @action start(){
    clearInterval(this.interval)

    this.paused = false
    this.currentTime = new Date()
    const roundTime = this.getCurrentRound().time
    this.endTime = new Date(this.currentTime.getTime() + roundTime * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET)
    this.mutationTime = Date.now()

    graphqlClient.mutate({
      mutation: timerResume,
      variables: {
        currentTime:this.mutationTime.toString(),
        round: this.round,
        endTime:this.endTime.getTime().toString(),
      },
    })
    .then(::this.checkMutationSuccess)
    .catch(err=>{
      console.error("in start()", err)
      this.fetchTimer()
    })

    this.interval = setInterval(()=>{
      this.updateTimer()
    }, this.TIMER_INTERVAL)
  }

  @action resume(){
    clearInterval(this.interval)

    this.updateTimer(false)
    this.endTime = new Date(this.currentTime.getTime() + this.offset)
    this.mutationTime = Date.now()
    this.paused = false

    graphqlClient.mutate({
      mutation: timerResume,
      variables: {
        currentTime:this.mutationTime.toString(),
        round: this.round,
        endTime:this.endTime.getTime().toString(),
      },
    })
    .then(::this.checkMutationSuccess)
    .catch(err=>{
      console.error("in resume()", err)
      this.fetchTimer()
    })

    this.interval = setInterval(()=>{
      this.updateTimer()
    }, this.TIMER_INTERVAL)
  }

  @action updateTimer(updateRound=true){
    this.currentTime = new Date()
    const timeDiff = this.endTime-this.currentTime

    if (timeDiff<11*1000 && timeDiff>9*1000){
      this.blindsSound.play()
    }else if (updateRound && timeDiff<0){
      this.round++
      const roundTime = this.getCurrentRound().time
      this.endTime = new Date(this.currentTime.getTime() +
      roundTime * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET)
    }
  }

  @action startOrResume(){
    if (this.endTime===undefined){
      this.start()
    }else{
      this.resume()
    }
  }

  @action pause(){
    clearInterval(this.interval)

    this.currentTime = new Date()
    this.offset = this.endTime.getTime() - this.currentTime.getTime()
    this.paused = true
    this.mutationTime = Date.now()

    graphqlClient.mutate({
      mutation: timerPause,
      variables: {
        currentTime:this.mutationTime.toString(),
        round: this.round,
        offset:this.offset.toString(),
      },
    })
    .then(::this.checkMutationSuccess)
    .catch(err=>{
      console.error("in pause()", err)
      this.fetchTimer()
    })
  }

  @action setRound(round){
    clearInterval(this.interval)

    this.round = round
    this.currentTime = new Date()
    this.mutationTime = Date.now()

    const roundTime = this.getCurrentRound().time

    if (this.paused){
      this.offset = roundTime * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET
    }else{
      this.endTime = new Date(this.currentTime.getTime() + roundTime * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET)
    }

    graphqlClient.mutate({
      mutation: timerUpdateRound,
      variables: {
        currentTime:this.mutationTime.toString(),
        round:this.round,
        paused:this.paused,
        endTime: this.endTime.getTime().toString(),
      },
    })
    .then(::this.checkMutationSuccess)
    .catch(err=>{
      console.error('in pause()', err)
      this.fetchTimer()
    })

    if (!this.paused){
      this.interval = setInterval(()=>{
        this.updateTimer()
      }, this.TIMER_INTERVAL)
    }
  }

  @action addRound(){
    this.rounds.push(Object.assign({},this.getLastRound()))
    this.mutationTime = Date.now()

    graphqlClient.mutate({
      mutation: timerRoundsUpdate,
      variables: {
        currentTime:this.mutationTime.toString(),
        rounds:{rounds:this.rounds}},
    })
    .then(::this.checkMutationSuccess)
    .catch(err=>{
      console.error('addRound()' , err)
    })
  }

  @action removeRound(index){
    this.rounds.splice(index,1)
    this.mutationTime = Date.now()

    graphqlClient.mutate({
      mutation: timerRoundsUpdate,
      variables: {
        currentTime:this.mutationTime.toString(),
        rounds:{rounds:this.rounds}},
    })
    .then(::this.checkMutationSuccess)
    .catch(err=>{
      console.error('removeRound()' ,err)
    })
  }

  @action addBreak(){
    this.rounds.push({type:'break', time:10})
    this.mutationTime = Date.now()

    graphqlClient.mutate({
      mutation: timerRoundsUpdate,
      variables: {
        currentTime:this.mutationTime.toString(),
        rounds:{rounds:this.rounds}},
    })
    .then(::this.checkMutationSuccess)
    .catch(err=>{
      console.error("in addBreak()", err)
      this.fetchTimer()
    })
  }

  @action updateRound(round, propName, value){

    round[propName] = value
    if (propName==='smallBlind'){
      round['bigBlind'] = value*2
    }

    if (this.autoUpdateBlinds){
      const changedRoundIndex = this.rounds.indexOf(round)
      const oldSmallBlinds = this.rounds.slice(0, changedRoundIndex+1).map((round)=>round.smallBlind)
      const newSmallBlinds = fillBlinds(oldSmallBlinds, this.rounds.length)
      for(let index=changedRoundIndex+1; index<newSmallBlinds.length; index++){
        this.rounds[index].smallBlind = newSmallBlinds[index]
        this.rounds[index].bigBlind = this.rounds[index].smallBlind*2
      }
    }

    this.debouncedMutateRounds()
  }

  @action setTimer(timer){
    if (timer !== null){

      clearInterval(this.interval)

      this.paused = timer.paused
      this.round = timer.round
      this.currentTime = new Date(parseInt(timer.currentTime))
      this.recovered = timer.recovered

      if (timer.rounds){
        this.rounds = this.getRounds(timer.rounds)
      }

      // Can be undefined or null
      if (timer.endTime){
        this.endTime = new Date(parseInt(timer.endTime))
      }else{
        this.endTime = undefined
      }

      // Can be undefined or null
      if (timer.offset!==undefined && timer.offset!==null){
        this.offset = parseInt(timer.offset)
      }

      if (!timer.paused){
        this.interval = setInterval(()=>{
          this.updateTimer()
        }, this.TIMER_INTERVAL)
      }

      this.loading = false || timer.recovered
    }
  }

  @action
  fetchTimer(){
    graphqlClient.query({query: timerQuery})
    .then(res => {
      this.setTimer(res.data.timer)
    }).catch(err => {
      console.error('in fetchTimer', err)
    })
  }

  @action.bound
  checkMutationSuccess(res){
    // TODO do it better?, the field in data is the name of the mutation defined in server's schema
    const resTimer = res.data[Object.keys(res.data)[0]]

    // TODO mabey there is more correct way to check the mutation was submitted
    if (parseInt(resTimer.currentTime) !== this.mutationTime){
      this.setTimer(resTimer)
    }
  }

  @action
  setResetRespose(reset){
    this.mutationTime = Date.now()
    this.recovered=false

    if (reset){
      const round = 1
      const currentTime = new Date()
      const endTime = new Date(currentTime + this.rounds[round-1].roundTime * this.MINUTES_MULTIPLIER)
      this.setTimer({
        paused: true,
        round,
        currentTime,
        endTime,
        recovered: false,
      })
    }

    graphqlClient.mutate({
      mutation: timerResetResponseSetting,
      variables: {
        currentTime: this.mutationTime.toString(),
        reset,
      },
    })
    .then(::this.checkMutationSuccess)
    .catch(err=>{
      console.error('setResetRespose', err)
    })
    this.loading = false
  }

  @computed
  get timeLeft(){

    let diff
    if (!this.paused){
      diff = this.endTime - this.currentTime
    }else{
      diff = this.offset
    }

    const minutes = Math.floor(diff/1000/60)
    const seconds = Math.floor(diff/1000%60)

    const parsedMinutes = minutes>9?`${minutes}`:`0${minutes}`
    const parsedSeconds = seconds>9?`${seconds}`:`0${seconds}`

    return `${parsedMinutes}:${parsedSeconds}`
  }

  @computed
  get precentageComplete(){
    const currentRound = this.getCurrentRound()
    const totalRoundTime = currentRound.time
    const timePassed = this.paused ? this.offset : this.endTime - this.currentTime
    const roundTime = totalRoundTime * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET
    const percentageComplete = 100 - (timePassed/roundTime*100)
    return percentageComplete
  }

  @computed
  get ante(){
    const currentRound = this.getCurrentRound()

    if (currentRound.type==='break'){
      return 'Break'
    }
    if (!currentRound.ante){
      return null
    }
    return `${currentRound.ante}`
  }

  @computed
  get nextAnte(){
    if (this.round<this.rounds.length){
      const nextRound = this.rounds[this.round]
      if (nextRound.type==='break'){
        return 'Break'
      }
      if (!nextRound.ante){
        return null
      }
      return `Next ${nextRound.ante}`
    }
  }

  @computed
  get blinds(){
    const currentRound = this.getCurrentRound()

    if (currentRound.type==='break'){
      return 'Break'
    }
    const currentBlinds = `${currentRound.smallBlind}/${currentRound.bigBlind}`
    return currentBlinds
  }

  @computed
  get nextBlinds(){
    if (this.round<this.rounds.length){
      const nextRound = this.rounds[this.round]
      if (nextRound.type==='break'){
        return 'Break'
      }
      return `Next ${nextRound.smallBlind}/${nextRound.bigBlind}`
    }
  }

  getLastRound(){
    const rounds = this.rounds.filter(round=>round.type!=='break')
    if (rounds.length>0)
      return rounds[rounds.length-1]
    else
      return this.DEFAULT_INITIAL_ROUND
  }

  getCurrentRound(){
    let currentRound
    if (this.rounds.length>this.round-1){
      currentRound = this.rounds[this.round-1]
    }else{
      currentRound = this.getLastRound()
    }

    return currentRound
  }

  getRounds(rounds){
    return rounds.map(({
      ante,
      smallBlind,
      bigBlind,
      time,
      type,
    })=>({
      ante,
      smallBlind,
      bigBlind,
      time,
      type,
    }))
  }

  // Send timerRoundsUpdate graghgl mutation
  mutateRounds(){
    this.mutationTime = Date.now()
    graphqlClient.mutate({
      mutation: timerRoundsUpdate,
      variables: {
        currentTime:this.mutationTime.toString(),
        rounds:{rounds:this.rounds}},
    })
    .then(::this.checkMutationSuccess)
    .catch(err=>{
      console.error('in updateRound', err)
    })
  }
}
