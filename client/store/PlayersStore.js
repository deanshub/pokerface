// @flow

import { observable, action, computed, toJS } from 'mobx'
import avatarImage from '../assets/images/avatar.png'
import lokkaClient from './lokkaClient'
import {playersQuery} from './queries/players'

export class PlayersStore {
  @observable currentPlayers
  @observable searchPlayers

  initialBuyIn=100
  initialWin=0

  constructor(){
    this.currentUser = {
      username:'deanshub',
      fullName: 'Dean Shub',
      avatar: '/images/dean2.jpg',
      buyIns: [{value: this.initialBuyIn, key:Math.random()}],
      winnings: [{value: this.initialWin, key:Math.random()}],
    }

    this.currentPlayers = observable.map({[this.currentUser.username]: this.currentUser})
    this.searchPlayers = observable.map({[this.currentUser.username]: this.currentUser})
    this.searchLoading = false
  }

  @action
  search(phrase){
    this.searchLoading = true
    this.searchValue = phrase
    lokkaClient.query(playersQuery, {phrase}).then((result)=>{
      const playersObj = result.players.reduce((res, player)=>{
        res[player.username] = Object.assign({},player,{
          buyIns: [{value: this.initialBuyIn, key:Math.random()}],
          winnings: [{value: this.initialWin, key:Math.random()}],
        })
        return res
      },{})

      this.searchPlayers.replace(Object.assign({},playersObj, toJS(this.currentPlayers)))
      this.searchLoading = false
    }).catch((err)=>{
      console.error(err)
    })
  }

  getPlayer(username){
    let player = this.searchPlayers.get(username)
    if (player===undefined){
      player = {
        username,
        fullName:username,
        avatar: avatarImage,
        buyIns: [{value: this.initialBuyIn, key:Math.random()}],
        winnings: [{value: this.initialWin, key:Math.random()}],
      }
      this.searchPlayers.set(username, player)
    }
    return player
  }

  @action
  setPlayer(users){
    const players = users.reduce((res, user)=>{

      res[user] = this.getPlayer(user)
      return res
    },{})

    this.currentPlayers.replace(players)
  }

  @computed
  get currentPlayersArray(){
    return this.currentPlayers.keys()
  }

  @action
  addBuyIn(user){
    this.currentPlayers.get(user).buyIns.push({value: this.initialBuyIn, key:Math.random()})
  }
  @action
  removeBuyIn(user, index){
    const {buyIns} = this.currentPlayers.get(user)
    buyIns.splice(index, 1)
  }

  @action
  addWin(user){
    this.currentPlayers.get(user).winnings.push({value: this.initialWin, key:Math.random()})
  }
  @action
  removeWin(user, index){
    const {winnings} = this.currentPlayers.get(user)
    winnings.splice(index, 1)
  }
}
