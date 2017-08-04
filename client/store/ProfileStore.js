// @flow

import { observable, action } from 'mobx'
import * as ProfileConsts from '../constants/profile'
import lokkaClient from './lokkaClient'
import {playersQuery} from './queries/players'
import {updatePersonalInfoMutation} from './mutations/players'

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
      lokkaClient.query(playersQuery, {username:user}).then((result)=>{
        this.currentUser = observable.map(result.players[0])
        this.setImageFiles()
      })
    }else{
      this.currentUser = observable.map(user)
      this.setImageFiles()
    }
  }

  setImageFiles(): void{
    const coverImage = this.currentUser.get('coverImage')
    if(coverImage!==undefined){
      if (coverImage.startsWith('http')){
        this.currentUser.set('imageFile', coverImage)
      }else{
        import(`../assets/images/${coverImage}`).then(imageFile=>{
          this.currentUser.set('imageFile', imageFile)
        })
      }
    }

    const avatarUrl = this.currentUser.get('avatar')
    if(avatarUrl!==undefined){
      if (avatarUrl.startsWith('http')){
        this.currentUser.set('avatarImage', avatarUrl)
      }else{
        import(`../assets/images/${avatarUrl}`).then(avatarImage=>{
          this.currentUser.set('avatarImage', avatarImage)
        })
      }
    }
  }

  updatePersonalInfo(info): void{
    // return lokkaClient.mutate(updatePersonalInfoMutation, {firstname:'aba', info})
    return Promise.resolve(info)
  }
}
