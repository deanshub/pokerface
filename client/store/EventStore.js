// @flow

import { observable, action, toJS } from 'mobx'
import graphqlClient from './graphqlClient'
import {eventsQuery} from './queries/events'
import {gameAttendanceUpdate, addGame, deleteGame} from './mutations/games'
import logger from '../utils/logger'
import moment from 'moment'

export class EventStore {
  @observable games
  @observable loading: boolean
  @observable expendedGameId


  constructor(){
    this.games = observable.map({})
    this.loading = false
  }

  setGame(game){
    const newGame = {
      ...toJS(game),
      from : moment(game.from),
      to : moment(game.to),
      createdAt : moment(game.createdAt),
      updatedAt : moment(game.updatedAt),
    }
    this.games.set(newGame.id, newGame)
  }

  @action
  fetchMyGames(): void{
    this.loading = true
    graphqlClient.query({query: eventsQuery}).then((result)=>{
      result.data.games.forEach(::this.setGame)
      this.loading = false
    }).catch(err=>{
      this.loading = false
      console.error(err)
    })
  }

  @action
  deleteGame(game){
    logger.logEvent({category:'Game',action:'Delete'})
    this.games.delete(game.id)
    graphqlClient.mutate({mutation: deleteGame, variables: {gameId: game.id}})
    .then(res=>{
      console.log(res.data.deleteGame)
    }).catch(err=>{
      console.error(err)
      this.games.set(game.id, game)
    })
  }

  add(item, arr){
    const arrItem = arr.find((arrItem)=>arrItem.username===item.username)
    if (arrItem===undefined){
      arr.push(item)
    }
  }
  remove(item, arr){
    const arrItem = arr.find((arrItem)=>arrItem.username===item.username)
    if (arrItem){
      arr.remove(arrItem)
    }
  }

  @action
  fillAttendance(user, gameId, attendance){
    let game = this.games.get(gameId)
    const oldGame = toJS(game)

    graphqlClient.mutate({mutation: gameAttendanceUpdate, variables: {gameId, attendance}})
    .then((res)=>{
      this.setGame(res.data.gameAttendanceUpdate)
    })
    .catch(err=>{
      console.error(err);
      this.setGame(oldGame)
    })

    if (attendance===null){
      logger.logEvent({category:'Game',action:'Attendance update', value:0})
      this.remove(user, game.accepted)
      this.remove(user, game.declined)
      this.add(user, game.unresponsive)
    }else if (attendance===true){
      logger.logEvent({category:'Game',action:'Attendance update', value:1})
      this.add(user, game.accepted)
      this.remove(user, game.declined)
      this.remove(user, game.unresponsive)
    }else if (attendance===false){
      logger.logEvent({category:'Game',action:'Attendance update', value:-1})
      this.remove(user, game.accepted)
      this.add(user, game.declined)
      this.remove(user, game.unresponsive)
    }
  }

  @action createGame(players, game){
    const normalizedPlayers = players.map(player=>{
      return {
        username: player.guest?undefined:player.username,
        fullname: player.guest?player.fullname:undefined,
        guest: player.guest,
      }
    })
    let currentGame = toJS(game)

    logger.logEvent({category:'Game',action:'Create'})
    return graphqlClient.mutate({mutation: addGame, variables: {...currentGame, players:JSON.stringify(normalizedPlayers)}})
    .then((res)=>{
      this.setGame(res.data.addGame)
      return res.data.addGame
    })
    .catch(err=>{
      console.error(err)
      return {err}
    })
  }

  @action.bound
  refresh(){
    this.games.clear()
    this.loading = true
    graphqlClient.query({
      fetchPolicy:'network-only',
      query: eventsQuery,
    }).then((result)=>{
      result.data.games.forEach(::this.setGame)
      this.loading = false
    }).catch(err=>{
      this.loading = false
      console.error(err)
    })
  }
}
