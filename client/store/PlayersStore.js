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
    this.currentPlayers = observable.map({})
    this.searchPlayers = observable.map({})
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
    const player = this.searchPlayers.get(username)

    return player
    // return Object.assign({},player,{
    //   buyIns: [{value: this.initialBuyIn, key:Math.random()}],
    //   winnings: [{value: this.initialWin, key:Math.random()}],
    // })
  }

  @action
  setPlayer(users){
    const players = users.reduce((res, user)=>{
      const player = this.getPlayer(user)
      if (player){
        res[user] = player
      }
      return res
    },{})

    this.currentPlayers.replace(players)
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
    this.currentPlayers.set(guestKey, guest)
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

  @action
  setAuthenticatedUser(user){
    this.searchPlayers.set(user.username, user)
    this.currentPlayers.set(user.username, user)
  }
}
