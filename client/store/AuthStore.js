// @flow

import { observable, action } from 'mobx'
import request from 'superagent'
import { close } from './graphqlClient'

export class AuthStore {
  @observable token
  @observable user
  @observable opensourceModalOpen: boolean
  @observable authenticating: boolean

  constructor(){
    this.user = {}
    this.authenticating = true
    // this.authenticate()
    this.opensourceModalOpen = false
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
    return request.post('/api/isAuthenticated').set('Authorization', localStorage.getItem('jwt')).then((res)=>{
      this.authenticating = false
      const player = res.body
      return this.user=player
    }).catch(err=>{
      console.error(err)
      this.authenticating = false
    })
  }

  @action
  logout(){
    this.user = {}
    close()
  }
}
