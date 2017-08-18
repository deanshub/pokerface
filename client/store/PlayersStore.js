// @flow

import { observable, action, computed, toJS } from 'mobx'
import avatarImage from '../assets/images/avatar.png'
import graphqlClient from './graphqlClient'
import {playersQuery} from './queries/players'

export class PlayersStore {
  @observable currentPlayers
  @observable searchPlayers

  initialBuyIn=100
  initialWin=0

  constructor(){
    // TODO: fill with auth user
    this.currentUser = {
      username:'deanshub',
      fullname: 'Dean Shub',
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
    graphqlClient.query({query: playersQuery, variables: {phrase}}).then((result)=>{
      let playersObj = {}
      if (result.data.players){
        playersObj = result.data.players.reduce((res, player)=>{
          res[player.username] = Object.assign({},player,{
            buyIns: [{value: this.initialBuyIn, key:Math.random()}],
            winnings: [{value: this.initialWin, key:Math.random()}],
          })
          return res
        },{})
      }

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
        guest: true,
        username,
        fullname:username,
        avatar: avatarImage,
      }
    }

    return Object.assign({},player,{
      buyIns: [{value: this.initialBuyIn, key:Math.random()}],
      winnings: [{value: this.initialWin, key:Math.random()}],
    })
  }

  @computed
  get currentPlayersObject(){
    return toJS(this.currentPlayers)
  }

  @action
  setPlayer(users){
    if (this.guest){
      this.currentPlayers.set(this.guest.username, this.guest)
      this.guest = null
    }else{
      const players = users.reduce((res, user)=>{
        res[user] = this.getPlayer(user)
        return res
      },{})

      this.currentPlayers.replace(players)
    }
  }

  @action
  addGuest(name){
    const guestKey = `guest${Math.random().toString()}`
    const guest = {
      guest: true,
      username:guestKey,
      fullname:name,
      avatar: avatarImage,
    }
    this.searchPlayers.set(guestKey, guest)
    this.guest = guest
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
