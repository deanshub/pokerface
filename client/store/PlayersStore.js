// @flow

import { observable, action, computed, toJS } from 'mobx'
import avatarImage from '../assets/images/avatar.png'
import graphqlClient from './graphqlClient'
import {usersQuery} from './queries/users'

export class PlayersStore {
  @observable currentPlayers
  @observable searchPlayers

  initialBuyIn=100
  initialWin=0

  constructor(){
    this.currentPlayers = observable([])
    this.searchPlayers = observable.map({})
    this.searchLoading = false
  }

  extendPlayer(player){
    return Object.assign({},{
      // buyIns: [{value: this.initialBuyIn, key:Math.random()}],
      // winnings: [{value: this.initialWin, key:Math.random()}],
      guest: false,
      cards: '',
      showCards: false,
      bank: 100,
    }, player)
  }

  @action
  search(phrase){
    this.searchLoading = true
    this.searchValue = phrase
    graphqlClient.query({query: usersQuery, variables: {phrase}}).then((result)=>{
      // let playersObj = {}
      // if (result.data.players){
      //   playersObj = result.data.players.reduce((res, player)=>{
      //     res[player.username] = Object.assign({},player,{
      //       buyIns: [{value: this.initialBuyIn, key:Math.random()}],
      //       winnings: [{value: this.initialWin, key:Math.random()}],
      //     })
      //     return res
      //   },{})
      // }
      // this.searchPlayers.replace(Object.assign({},playersObj, toJS(this.currentPlayers)))

      if (result.data.users){
        this.searchPlayers.clear()
        result.data.users.forEach((user)=>{
          this.searchPlayers.set(user.username, this.extendPlayer(user))
        })
      }

      this.searchLoading = false
    }).catch((err)=>{
      console.error(err)
    })
  }

  @computed
  get immutableAvailablePlayers(){
    // name, link, avatar
    const suggestedPlayersObj = this.searchPlayers.toJS()
    const suggestedPlayers = Object.keys(suggestedPlayersObj).map(playerKey=>{
      const player = suggestedPlayersObj[playerKey]
      // TODO: remove name
      return {
        name: player.fullname,
        fullname: player.fullname,
        avatar: player.avatar,
        username: player.username,
        link: `/profile/${player.username}`,
      }
    })
    return suggestedPlayers
  }

  getPlayer(username){
    const player = this.searchPlayers.get(username)
    return player
  }

  @action
  setPlayer(playerIndex, newUser){
    if (newUser.guest){
      newUser.username = `guest-${Math.random().toString()}`
      newUser.avatar = 'images/avatar.png'
    }
    this.currentPlayers[playerIndex] = newUser
  }

  @action
  addGuest(name){
    const guestKey = `guest${Math.random().toString()}`
    const guest = this.extendPlayer({
      guest: true,
      username:guestKey,
      fullname:name,
      avatar: avatarImage,
    })

    this.currentPlayers.push(guest)
  }

  @action
  movePlyaerUp(playerIndex){
    if (playerIndex>0){
      const [item] = this.currentPlayers.splice(playerIndex, 1)
      this.currentPlayers.splice(playerIndex-1, 0, item)
    }
  }
  @action
  movePlyaerDown(playerIndex){
    if (playerIndex<this.currentPlayers.length-1){
      const [item] = this.currentPlayers.splice(playerIndex, 1)
      this.currentPlayers.splice(playerIndex+1, 0, item)
    }
  }

  // @action
  // addBuyIn(user){
  //   this.currentPlayers.get(user).buyIns.push({value: this.initialBuyIn, key:Math.random()})
  // }
  // @action
  // removeBuyIn(user, index){
  //   const {buyIns} = this.currentPlayers.get(user)
  //   buyIns.splice(index, 1)
  // }
  //
  // @action
  // addWin(user){
  //   this.currentPlayers.get(user).winnings.push({value: this.initialWin, key:Math.random()})
  // }
  // @action
  // removeWin(user, index){
  //   const {winnings} = this.currentPlayers.get(user)
  //   winnings.splice(index, 1)
  // }

  @action
  setAuthenticatedUser(user){
    const extendedUser = this.extendPlayer(user)
    this.searchPlayers.set(extendedUser.username, extendedUser)
    this.currentPlayers.push(extendedUser)
  }
}
