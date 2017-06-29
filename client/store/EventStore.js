// @flow

import { observable, action, computed, toJS } from 'mobx'
import lokkaClient from './lokkaClient'
import {eventsQuery} from './queries/events'
import {gameAttendanceUpdate} from './mutations/games'

export class EventStore {
  @observable games
  @observable loading: boolean

  constructor(){
    this.games = observable.map({})
    this.loading = false
  }

  setGame(game){
    game.from = new Date(game.from)
    game.to = new Date(game.to)
    game.createdAt = new Date(game.createdAt)
    game.updatedAt = new Date(game.updatedAt)
    this.games.set(game.id, game)
  }

  @action
  fetchMyGames(): void{
    this.loading = true
    lokkaClient.query(eventsQuery).then((result)=>{
      result.games.forEach(::this.setGame)
      this.loading = false
    }).catch(err=>{
      this.loading = false
      console.error(err)
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

    lokkaClient.mutate(gameAttendanceUpdate,{gameId, attendance})
    .then((res)=>{
      this.setGame(res.gameAttendanceUpdate)
    })
    .catch(err=>{
      console.error(err);
      this.setGame(oldGame)
    })
  }
}
