// @flow

import { observable, action, computed, toJS } from 'mobx'
import lokkaClient from './lokkaClient'
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
    lokkaClient.query(playersQuery, {phrase}).then((result)=>{
      this.availablePlayers.replace(result.players.map(player=>{
        player.childKey=player.username
        return player
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
        avatar: player.avatar.includes('http')?player.avatar:`/images/${player.avatar}`,
        username: player.username,
        link: `/profile/${player.username}`,
      }
    })
    return fromJS(suggestedPlayers)
  }
}
