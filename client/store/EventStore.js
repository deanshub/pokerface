// @flow

import { observable, action, toJS } from 'mobx'
import graphqlClient from './graphqlClient'
import {eventsQuery} from './queries/events'
import {gameAttendanceUpdate, addGame, deleteGame} from './mutations/games'
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
    this.games.delete(game.id)
    graphqlClient.mutate({mutation: deleteGame, variables: {gameId: game.id}})
    .then(res=>{
      console.log(res.data.deleteGame)
    }).catch(err=>{
      console.error(err)
      this.games.set(game.id, game)
    })
  }

  @action
  fillAttendance(username, gameId, attendance){
    let game = this.games.get(gameId)
    const oldGame = toJS(game)
    const acceptedIndex = game.accepted.indexOf(username)
    const declinedIndex = game.declined.indexOf(username)

    if (declinedIndex>-1 && attendance){
      game.declined.splice(declinedIndex, 1)
    }else if (declinedIndex===-1 && !attendance){
      game.declined.push(username)
    }

    if (acceptedIndex>-1 && !attendance){
      game.accepted.splice(acceptedIndex, 1)
    }else if (acceptedIndex===-1 && attendance) {
      game.accepted.push(username)
    }

    graphqlClient.mutate({mutation: gameAttendanceUpdate, variables: {gameId, attendance}})
    .then((res)=>{
      this.setGame(res.data.gameAttendanceUpdate)
    })
    .catch(err=>{
      console.error(err);
      this.setGame(oldGame)
    })
  }

  @action createGame(players, game){
    let currentGame = game.toJS()
    return graphqlClient.mutate({mutation: addGame, variables: {...currentGame, players}})
    .then((res)=>{
      this.setGame(res.data.addGame)
      return res.data.addGame
    })
    .catch(err=>{
      console.error(err)
      return {err}
    })
  }
}
