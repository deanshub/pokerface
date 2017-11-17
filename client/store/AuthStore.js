// @flow

import { observable, action } from 'mobx'
import request from 'superagent'
import { close } from './graphqlClient'
import logger from '../utils/logger'


export class AuthStore {
  @observable token
  @observable user
  @observable opensourceModalOpen: boolean
  @observable modalModalOpen: boolean
  @observable authenticating: boolean

  constructor(){
    this.user = {}
    this.authenticating = true
    // this.authenticate()
    this.opensourceModalOpen = false
    this.modalModalOpen = false
  }

  @action
  updateUserInfo(info){
    this.user = {
      ...this.user,
      ...info,
    }
  }

  @action
  authenticate(){

    this.authenticating = true
    return request.post('/login/isAuthenticated').set('Authorization', localStorage.getItem('jwt')).then((res)=>{
      this.authenticating = false
      const player = res.body
      logger.setField({user:player.username, email:player.email})
      return this.user=player
    }).catch(err=>{
      console.error(err)
      this.authenticating = false
    })
  }

  // @action
  // authenticateByUuid(uuid){
  //   this.authenticating = true
  //
  //   return request.post('/login/isAuthenticated').set('Authorization', localStorage.getItem('jwt')).then((res)=>{
  //     this.authenticating = false
  //     const player = res.body
  //     logger.setField({user:player.username, email:player.email})
  //     return this.user=player
  //   }).catch(err=>{
  //     console.error(err)
  //     this.authenticating = false
  //   })
  // }

  @action
  logout(){
    logger.logEvent({category:'User',action:'Logout'})
    this.user = {}
    close()
  }
}
