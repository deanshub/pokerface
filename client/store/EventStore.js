// @flow

import { observable, computed, action, toJS } from 'mobx'
import graphqlClient from './graphqlClient'
import {eventsQuery, eventQuery, searchEventsQuery} from './queries/events'
import {eventAttendanceUpdate, addEvent, deleteEvent, updateEvent} from './mutations/events'
import { eventChanged } from './subscriptions/events'
import logger from '../utils/logger'
import moment from 'moment'

export class EventStore {
  @observable events
  @observable loading: boolean
  @observable expendedGameId
  @observable currentEvent
  @observable loadingCurrentEvent: boolean
  @observable searchEventsResult
  @observable searchLoading: boolean

  constructor(){
    this.events = observable.map({})
    this.loading = false
    this.loadingCurrentEvent = false
    this.searchEventsResult= []
    this.subscribed = false
  }

  @action
  startSubscription(){
    if (!this.subscribed){
      graphqlClient.subscribe({
        query:eventChanged,
      }).subscribe({
        next:({eventChanged})=>{
          console.log(eventChanged);
          if (eventChanged.changeType === 'DELETE') {
            this.events.delete(eventChanged.event.id)
          }else{
            this.setEvent(eventChanged.event)
          }
        },
      })
    }
  }

  setEvent(game){
    const newGame = {
      ...toJS(game),
      startDate : moment(game.from),
      endDate : moment(game.to),
      createdAt : moment(game.createdAt),
      updatedAt : moment(game.updatedAt),
    }
    this.events.set(newGame.id, newGame)
  }

  @action
  fetchMyGames(): void{
    this.loading = true
    graphqlClient.query({query: eventsQuery}).then((result)=>{
      result.data.events.forEach(::this.setEvent)
      this.loading = false
    }).catch(err=>{
      this.loading = false
      console.error(err)
    })
  }

  @action
  deleteEvent(game){
    logger.logEvent({category:'Game',action:'Delete'})
    this.events.delete(game.id)
    graphqlClient.mutate({mutation: deleteEvent, variables: {eventId: game.id}})
    .then(res=>{
      console.log(res.data.deleteEvent)
    }).catch(err=>{
      console.error(err)
      this.events.set(game.id, game)
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
  fillAttendance(user, eventId, attendance){
    let game = this.events.get(eventId)
    const oldGame = toJS(game)

    graphqlClient.mutate({mutation: eventAttendanceUpdate, variables: {eventId, attendance}})
    .then((res)=>{
      this.setEvent(res.data.eventAttendanceUpdate)
    })
    .catch(err=>{
      console.error(err);
      this.setEvent(oldGame)
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
    if (this.currentEvent&&eventId===this.currentEvent.id){
      this.currentEvent = game
    }
  }

  @action
  saveEvent(event, coverImageFile){
    let currentGame = toJS(event)

    const normalizedPlayers = currentGame.invited.map(player=>{
      return {
        username: player.guest?undefined:player.username,
        fullname: player.guest?player.fullname:undefined,
        guest: player.guest,
      }
    })

    const coverImage = coverImageFile || null

    // update
    if (currentGame.id){
      logger.logEvent({category:'Game',action:'Update'})
      return graphqlClient.mutate({
        mutation: updateEvent,
        variables: {...currentGame, coverImage, players:JSON.stringify(normalizedPlayers)},
      })
      .then((res)=>{
        this.setEvent(res.data.updateEvent)
        return res.data.updateEvent
      })
      .catch(err=>{
        console.error(err)
        return {err}
      })
    }else{
      logger.logEvent({category:'Game',action:'Create'})
      return graphqlClient.mutate({
        mutation: addEvent,
        variables: {...currentGame, coverImage, players:JSON.stringify(normalizedPlayers)},
      })
      .then((res)=>{
        this.setEvent(res.data.addEvent)
        return res.data.addEvent
      })
      .catch(err=>{
        console.error(err)
        return {err}
      })
    }
  }

  @action.bound
  refresh(){
    this.events.clear()
    this.loading = true
    graphqlClient.query({
      //fetchPolicy:'network-only',
      query: eventsQuery,
    }).then((result)=>{
      result.data.events.forEach(::this.setEvent)
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
      this.currentEvent = result.data.event
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
    return this.eventToDetails(this.currentEvent)
  }

  eventToDetails(eventData){
    if (!eventData){
      return null
    }
    const {
      id,
      creator,
      title,
      type,
      subtype,
      description,
      location,
      startDate,
      accepted,
      declined,
      unresponsive,
      coverImage,
      title: fullname,
    } = eventData

    return {
      id,
      creator,
      title,
      type,
      subtype,
      description,
      location,
      startDate: moment(startDate),
      going: accepted.length,
      coverImage,
      fullname,
      accepted,
      declined,
      unresponsive,
    }
  }
}
