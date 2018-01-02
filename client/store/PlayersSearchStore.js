// @flow

import { observable, action, computed, toJS } from 'mobx'
import graphqlClient from './graphqlClient'
import {usersQuery} from './queries/users'
import logger from '../utils/logger'
import debounce from '../utils/debounce'

const searchTimeoutTime = 200

export class PlayersSearchStore {
  @observable availablePlayers
  @observable searchValue: string
  @observable loading: boolean

  constructor(){
    this.availablePlayers = []
    this.loading = false
    this.searchValue = ''
    this.debouncedFetchUsers = debounce(this.fetchUsers, searchTimeoutTime)
  }

  @action
  search(phrase): void{
    this.searchValue = phrase

    if (phrase.length>0){
      this.debouncedFetchUsers()
    }
  }

  @action
  fetchUsers(){
    this.loading = true
    const phrase = this.searchValue

    if (phrase.length === 0){
      this.availablePlayers = []
    }else{
      logger.logEvent({category:'Players search',action:'search'})
      graphqlClient.query({query: usersQuery, variables: {phrase}}).then((result)=>{
        this.availablePlayers.replace(result.data.users.map(player=>{
          return {...player, childKey:player.username}
        }))
        this.loading = false
      }).catch(e=>{
        console.error(e)
        this.loading = false
      })
    }
  }

  @computed
  get immutableAvailablePlayers(){
    // name, link, avatar
    const suggestedPlayers = toJS(this.availablePlayers).map(player=>{
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
}
