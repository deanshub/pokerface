// @flow

import { observable, action } from 'mobx'
import lokkaClient from './lokkaClient'

import {playersQuery} from './queries/players'


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
  search(phrase){
    this.loading = true
    this.searchValue = phrase
    lokkaClient.query(playersQuery, {phrase}).then((result)=>{
      this.availablePlayers.replace(result.players.map(player=>{
        player.childKey=player.username
        return player
      }))
      this.loading = false
    })
  }
}
