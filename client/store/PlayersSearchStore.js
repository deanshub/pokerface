// @flow

import { observable, action, computed, toJS } from 'mobx'
import graphqlClient from './graphqlClient'
import {playersQuery} from './queries/players'
import { fromJS } from 'immutable'
import logger from '../utils/logger'

const searchTimeoutTime = 200

export class PlayersSearchStore {
  @observable availablePlayers
  @observable searchValue: string
  @observable loading: boolean

  constructor(){
    this.availablePlayers = []
    this.loading = false
    this.searchValue = ''
  }

  @action
  search(phrase): void{
    this.searchValue = phrase
    this.loading = true
    clearTimeout(this.timeout)
    if (phrase.length<1) {
      this.loading = false
    }else{
      this.timeout = setTimeout(()=>{
        logger.logEvent({category:'Players search',action:'search'})
        graphqlClient.query({query: playersQuery, variables: {phrase}}).then((result)=>{
          this.availablePlayers.replace(result.data.players.map(player=>{
            return {...player, childKey:player.username}
          }))
          this.loading = false
        }).catch(e=>{
          console.error(e)
          this.loading = false
        })
      }, searchTimeoutTime)
    }
  }

  @computed
  get immutableAvailablePlayers(){
    // name, link, avatar
    const suggestedPlayers = toJS(this.availablePlayers).map(player=>{
      return {
        name: player.fullname,
        avatar: player.avatar,
        username: player.username,
        link: `/profile/${player.username}`,
      }
    })
    return fromJS(suggestedPlayers)
  }
}
