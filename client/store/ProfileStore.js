// @flow

import { observable, action } from 'mobx'
import * as ProfileConsts from '../constants/profile'
import graphqlClient from './graphqlClient'
import {playersQuery} from './queries/players'
// import {updatePersonalInfoMutation} from './mutations/players'

export class ProfileStore {
  @observable currentTab: string
  @observable currentUser: Object

  constructor(){
    this.currentTab = ProfileConsts.STATISTICS_TAB
    this.currentUser = observable.map({})
  }

  @action
  changeTab(tab: string): void{
    this.currentTab = tab
  }

  @action
  setCurrentUser(user): void{
    if (typeof user === 'string'){
      graphqlClient.query({query: playersQuery, variables: {username:user}}).then((result)=>{
        const player = result.data.players[0]
        this.currentUser = observable.map(player)
        this.setImageFiles()
      })
    }else{
      this.currentUser = observable.map(user)
      this.setImageFiles()
    }
  }

  setImageFiles(): void{
    const coverImage = this.currentUser.get('coverImage')
    if(coverImage){
      if (coverImage.startsWith('http')){
        this.currentUser.set('imageFile', coverImage)
      }else{
        import(`../assets/images/${coverImage}`).then(imageFile=>{
          this.currentUser.set('imageFile', imageFile)
        })
      }
    }

    const avatarUrl = this.currentUser.get('avatar')
    if(avatarUrl){
      this.currentUser.set('avatarImage', avatarUrl)
    }
  }

  updatePersonalInfo(info): void{
    // return graphqlClient.mutate({mutation: updatePersonalInfoMutation, variables: {firstname:'aba', info}})
    return Promise.resolve(info)
  }
}
