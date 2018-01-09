// @flow

import { observable, computed, action, toJS } from 'mobx'
import graphqlClient from './graphqlClient'
import {eventsQuery, eventQuery, searchEventsQuery} from './queries/events'
import {gameAttendanceUpdate, addGame, deleteGame} from './mutations/games'
import logger from '../utils/logger'
import moment from 'moment'

export class EventStore {
  @observable games
  @observable loading: boolean
  @observable expendedGameId
  @observable currentEvent
  @observable loadingCurrentEvent: boolean
  @observable searchEventsResult
  @observable searchLoading: boolean

  constructor(){
    this.games = observable.map({})
    this.loading = false
    this.loadingCurrentEvent = false
    this.searchEventsResult= []
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

  @action
  search(title){
    this.searchLoading = true
    graphqlClient.query({query: searchEventsQuery, variables:{title}}).then((result)=>{
      this.searchEventsResult =  result.data.search
      this.searchLoading = false
    }).catch(err=>{
      this.searchLoading = false
      console.error(err)
    })
  }

  @action
  setCurrentEvent(eventId){
    this.loadingCurrentEvent = true
    graphqlClient.query({
      // fetchPolicy:'network-only',
      query: eventQuery,
      variables: {eventId},
    }).then((result)=>{
      this.currentEvent = result.data.game
      this.loadingCurrentEvent = false
    }).catch(err=>{
      this.loadingCurrentEvent = false
      console.error(err)
    })
  }

  @action
  clearCurrentEvent(){
    this.currentEvent = undefined
  }

  get suggestedEvent(){
    return toJS(this.searchEventsResult)
  }
  @computed
  get currentEventDetails(){
    if (!this.currentEvent){
      return null
    }
    const {
      id,
      title,
      type,
      subtype,
      description,
      location,
      from,
      accepted,
      image: coverImage,
      title: fullname,
    } = this.currentEvent

    return {
      id,
      title,
      type,
      subtype,
      description,
      location,
      startDate: moment(from),
      going: accepted.length,
      coverImage,
      fullname,
    }
  }
}
