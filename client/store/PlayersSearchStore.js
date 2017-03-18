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
}
