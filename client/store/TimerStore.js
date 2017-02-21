import { observable, action, computed } from 'mobx'

export class TimerStore {
  @observable rounds

  @observable endTime
  @observable offset
  @observable round
  @observable paused
  @observable settingsModalOpen

  MINIMAL_OFFSET = 10
  MINUTES_MULTIPLIER = 60 * 1000
  INITIAL_ROUND ={
    ante: 10,
    smallBlind: 10,
    bigBlind: 20,
    time: 10,
    key: Math.random(),
  }

  constructor(){
    this.rounds = [
      this.INITIAL_ROUND,
      {
        ante: 10,
        smallBlind: 15,
        bigBlind: 30,
        time: 10,
        key: Math.random(),
      },
    ]

    this.round = 1
    this.paused = true
    this.offset = this.rounds[this.round-1].time * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET
    this.settingsModalOpen = false
  }

  @action start(){
    this.paused = false
    this.endTime = new Date((new Date()).getTime() + this.rounds[this.round-1].time * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET)
  }

  @action resume(){
    this.endTime = new Date(new Date().getTime() + this.offset)
    this.paused = false
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
      return this.INITIAL_ROUND
  }

  @action addRound(){
    this.rounds.push(Object.assign({},this.getLastRound(),{key:Math.random()}))
  }
  @action removeRound(index){
    this.rounds.splice(index,1)
  }
  @action addBreak(){
    this.rounds.push({type:'break', time:10, key:Math.random()})
  }

  getTimeLeft(){
    if (this.endTime!==undefined){
      const diff = this.endTime - new Date()

      const minutes = Math.floor(diff/1000/60)
      const seconds = Math.floor(diff/1000%60)

      const parsedMinutes = minutes>9?`${minutes}`:`0${minutes}`
      const parsedSeconds = seconds>9?`${seconds}`:`0${seconds}`

      return `${parsedMinutes}:${parsedSeconds}`
    }else{
      const minutes = this.rounds[this.round-1].time
      const parsedMinutes = minutes>9?`${minutes}`:`0${minutes}`
      return `${parsedMinutes}:00`
    }
  }

  getPrecentageComplete(){
    const timePassed = this.paused ? this.offset : this.endTime - new Date()
    const roundTime = this.rounds[this.round-1].time * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET
    const percentageComplete = 100 - (timePassed/roundTime*100)
    return percentageComplete
  }

  @computed get ante(){
    const currentRound = this.rounds[this.round-1]
    const currentAnte = `${currentRound.ante}`
    return currentAnte
  }
  @computed get nextAnte(){
    const nextRound = this.rounds[this.round]
    if (nextRound){
      return `Next ${nextRound.ante}`
    }
  }

  @computed get blinds(){
    const currentRound = this.rounds[this.round-1]
    const currentBlinds = `${currentRound.smallBlind}/${currentRound.bigBlind}`
    return currentBlinds
  }
  @computed get nextBlinds(){
    const nextRound = this.rounds[this.round]
    if (nextRound){
      return `Next ${nextRound.smallBlind}/${nextRound.bigBlind}`
    }
  }
}
