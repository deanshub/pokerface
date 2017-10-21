import { observable, action, computed } from 'mobx'
import {fillBlinds} from './blindsUtils/utils'

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
  @observable autoUpdateBlinds

  MINIMAL_OFFSET = 10
  MINUTES_MULTIPLIER = 60 * 1000
  DEFAULT_INITIAL_ROUND ={
    ante: 0,
    smallBlind: 2,
    bigBlind: 4,
    time: 15,
  }

  constructor(){
    const blindsTimerRounds = localStorage.getItem('blindsTimerRounds')
    if (blindsTimerRounds){
      this.rounds = JSON.parse(blindsTimerRounds)

      this.DEFAULT_INITIAL_ROUND = this.rounds[0]
    }else{
      this.rounds = [
        this.DEFAULT_INITIAL_ROUND,
        Object.assign({}, this.DEFAULT_INITIAL_ROUND, {
          smallBlind: 4,
          bigBlind: 8,
        }),
        Object.assign({}, this.DEFAULT_INITIAL_ROUND, {
          smallBlind: 5,
          bigBlind: 10,
        }),
        Object.assign({}, this.DEFAULT_INITIAL_ROUND, {
          smallBlind: 15,
          bigBlind: 30,
        }),
        Object.assign({}, this.DEFAULT_INITIAL_ROUND, {
          smallBlind: 30,
          bigBlind: 60,
        }),
        Object.assign({}, this.DEFAULT_INITIAL_ROUND, {
          smallBlind: 50,
          bigBlind: 100,
        }),
        Object.assign({}, this.DEFAULT_INITIAL_ROUND, {
          smallBlind: 70,
          bigBlind: 140,
        }),
        Object.assign({}, this.DEFAULT_INITIAL_ROUND, {
          smallBlind: 100,
          bigBlind: 200,
        }),
        Object.assign({}, this.DEFAULT_INITIAL_ROUND, {
          smallBlind: 150,
          bigBlind: 300,
        }),
        Object.assign({}, this.DEFAULT_INITIAL_ROUND, {
          smallBlind: 200,
          bigBlind: 400,
        }),
      ]
      this.updateLocalStorage()
    }

    this.round = 1
    this.paused = true
    this.offset = this.rounds[this.round-1].time * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET
    this.settingsModalOpen = false
    this.inverted = false
    this.settingsModalMountNode = undefined
    this.blindsSound = new Audio(require('../assets/10.mp3'))
    this.autoUpdateBlinds = true
  }

  @action start(){
    this.paused = false
    this.updateTimer(false)
    let currentRound
    if (this.rounds.length>this.round-1){
      currentRound = this.rounds[this.round-1]
    }else{
      currentRound = this.getLastRound()
    }
    const roundTime = currentRound.time
    this.endTime = new Date(this.currentTime.getTime() + roundTime * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET)
  }

  @action resume(){
    this.endTime = new Date(new Date().getTime() + this.offset)
    this.updateTimer(false)
    this.paused = false
  }

  @action updateTimer(updateRound=true){
    this.currentTime = new Date()
    const timeDiff = this.endTime-this.currentTime

    if (timeDiff<11*1000 && timeDiff>9*1000){
      this.blindsSound.play()
    }else if (updateRound && timeDiff<0){
      if (this.round-1<this.rounds.length){
        this.round++
      }
      this.start()
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
    this.offset = this.endTime - new Date()
    this.paused = true
  }

  getLastRound(){
    const rounds = this.rounds.filter(round=>round.type!=='break')
    if (rounds.length>0)
      return rounds[rounds.length-1]
    else
      return this.DEFAULT_INITIAL_ROUND
  }

  updateLocalStorage(){
    localStorage.setItem('blindsTimerRounds', JSON.stringify(this.rounds))
  }

  @action addRound(){
    this.rounds.push(Object.assign({},this.getLastRound()))
    this.updateLocalStorage()
  }
  @action removeRound(index){
    this.rounds.splice(index,1)
    this.updateLocalStorage()
  }
  @action addBreak(){
    this.rounds.push({type:'break', time:10})
    this.updateLocalStorage()
  }

  @computed
  get timeLeft(){
    if (this.endTime!==undefined){
      const diff = this.endTime - this.currentTime

      const minutes = Math.floor(diff/1000/60)
      const seconds = Math.floor(diff/1000%60)

      const parsedMinutes = minutes>9?`${minutes}`:`0${minutes}`
      const parsedSeconds = seconds>9?`${seconds}`:`0${seconds}`

      return `${parsedMinutes}:${parsedSeconds}`
    }else{
      let currentRound
      if (this.rounds.length>this.round-1){
        currentRound = this.rounds[this.round-1]
      }else{
        currentRound = this.getLastRound()
      }
      const minutes = currentRound.time
      const parsedMinutes = minutes>9?`${minutes}`:`0${minutes}`
      return `${parsedMinutes}:00`
    }
  }

  @computed
  get precentageComplete(){
    let currentRound
    if (this.rounds.length>this.round-1){
      currentRound = this.rounds[this.round-1]
    }else{
      currentRound = this.getLastRound()
    }

    const totalRoundTime = currentRound.time
    const timePassed = this.paused ? this.offset : this.endTime - this.currentTime
    const roundTime = totalRoundTime * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET
    const percentageComplete = 100 - (timePassed/roundTime*100)
    return percentageComplete
  }

  @computed
  get ante(){
    let currentRound
    if (this.rounds.length>this.round-1){
      currentRound = this.rounds[this.round-1]
    }else{
      currentRound = this.getLastRound()
    }

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
    let currentRound
    if (this.rounds.length>this.round-1){
      currentRound = this.rounds[this.round-1]
    }else{
      currentRound = this.getLastRound()
    }

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

  @action
  updateRound(round, propName, value){
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

    this.updateLocalStorage()
  }
}
