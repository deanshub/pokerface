// @flow

import { observable, action, computed, toJS } from 'mobx'

export class PlayersStore {
  @observable currentPlayers
  @observable searchePlayers

  initialBuyIn=100
  initialWin=0

  constructor(){
    this.currentUser = {
      user:'deanshub',
      image: '/images/dean2.jpg',
      name: 'Dean Shub',
      buyIns: [{value: this.initialBuyIn, key:Math.random()}],
      winnings: [{value: this.initialWin, key:Math.random()}],
    }

    this.currentPlayers = observable.map({[this.currentUser.user]: this.currentUser})

    this.searchePlayers = observable.map({
      [this.currentUser.user]: this.currentUser,
      zoeD: {
        user:'zoeD',
        image: 'http://semantic-ui.com/images/avatar/small/zoe.jpg',
        name: 'Zoe Dechannel',
        buyIns: [{value: this.initialBuyIn, key:Math.random()}],
        winnings: [{value: this.initialWin, key:Math.random()}],
      },
      nanWasa: {
        user:'nanWasa',
        image: 'http://semantic-ui.com/images/avatar/small/nan.jpg',
        name: 'Nan Wasa',
        buyIns: [{value: this.initialBuyIn, key:Math.random()}],
        winnings: [{value: this.initialWin, key:Math.random()}],
      },
    })
  }

  @action
  setPlayer(users){
    const players = users.reduce((res, user)=>{
      res[user] = this.searchePlayers.get(user)
      return res
    },{})
    this.currentPlayers.replace(players)
  }

  @computed
  get currentPlayersArray(){
    return this.currentPlayers.keys()
  }

  @action addBuyIn(user){
    this.currentPlayers.get(user).buyIns.push({value: this.initialBuyIn, key:Math.random()})
  }
  @action removeBuyIn(user, index){
    const {buyIns} = this.currentPlayers.get(user)
    buyIns.splice(index, 1)
  }

  @action addWin(user){
    this.currentPlayers.get(user).winnings.push({value: this.initialWin, key:Math.random()})
  }
  @action removeWin(user, index){
    const {winnings} = this.currentPlayers.get(user)
    winnings.splice(index, 1)
  }
}
