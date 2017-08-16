// @flow

import { observable, action, computed, toJS } from 'mobx'
import graphqlClient from './graphqlClient'
import {playersQuery} from './queries/players'
import { fromJS } from 'immutable'


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
    if (phrase.length<1) return undefined

    this.loading = true
    graphqlClient.query({query: playersQuery, variables: {phrase}}).then((result)=>{
      this.availablePlayers.replace(result.data.players.map(player=>{
        return {...player, childKey:player.username}
      }))
      this.loading = false
    })
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
