import { observable, action, computed } from 'mobx'

export class TimerStore {
  @observable rounds

  @observable currentTime
  @observable endTime
  @observable offset
  @observable round
  @observable paused
  @observable settingsModalOpen
  @observable inverted

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
      Object.assign({}, this.INITIAL_ROUND, {
        key: Math.random(),
        smallBlind: 15,
        bigBlind: 30,
      }),
      Object.assign({}, this.INITIAL_ROUND, {
        key: Math.random(),
        smallBlind: 20,
        bigBlind: 40,
      }),
      Object.assign({}, this.INITIAL_ROUND, {
        key: Math.random(),
        smallBlind: 30,
        bigBlind: 60,
      }),
      Object.assign({}, this.INITIAL_ROUND, {
        key: Math.random(),
        smallBlind: 50,
        bigBlind: 100,
      }),
      Object.assign({}, this.INITIAL_ROUND, {
        key: Math.random(),
        smallBlind: 150,
        bigBlind: 300,
      }),
    ]

    this.round = 1
    this.paused = true
    this.offset = this.rounds[this.round-1].time * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET
    this.settingsModalOpen = false
    this.inverted = false
  }

  @action start(){
    this.paused = false
    this.updateTimer()
    this.endTime = new Date(this.currentTime.getTime() + this.rounds[this.round-1].time * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET)
  }

  @action resume(){
    this.endTime = new Date(new Date().getTime() + this.offset)
    this.updateTimer()
    this.paused = false
  }

  @action updateTimer(){
    this.currentTime = new Date()
    return this.endTime-this.currentTime>0
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

  @computed
  get timeLeft(){
    if (this.endTime!==undefined){
      const diff = this.endTime - this.currentTime

      if (diff<0){
        if (this.round<this.rounds.length){
          this.round++
          this.start()
        }
        return '00:00'
      }

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

  @computed
  get precentageComplete(){
    const timePassed = this.paused ? this.offset : this.endTime - this.currentTime
    const roundTime = this.rounds[this.round-1].time * this.MINUTES_MULTIPLIER + this.MINIMAL_OFFSET
    const percentageComplete = 100 - (timePassed/roundTime*100)
    return percentageComplete
  }

  @computed get ante(){
    const currentRound = this.rounds[this.round-1]
    if (currentRound.type==='break'){
      return 'Break'
    }
    if (!currentRound.ante){
      return null
    }
    return `${currentRound.ante}`
  }
  @computed get nextAnte(){
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

  @computed get blinds(){
    const currentRound = this.rounds[this.round-1]
    if (currentRound.type==='break'){
      return 'Break'
    }
    const currentBlinds = `${currentRound.smallBlind}/${currentRound.bigBlind}`
    return currentBlinds
  }
  @computed get nextBlinds(){
    if (this.round<this.rounds.length){
      const nextRound = this.rounds[this.round]
      if (nextRound.type==='break'){
        return 'Break'
      }
      return `Next ${nextRound.smallBlind}/${nextRound.bigBlind}`
    }
  }
}
