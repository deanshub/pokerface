// @flow

import { observable, action } from 'mobx'
import request from 'superagent'

export class AuthStore {
  @observable user
  @observable opensourceModalOpen: boolean
  @observable authenticating: boolean

  constructor(){
    this.user = {
    }
    this.authenticating = true
    // this.authenticate()
    this.opensourceModalOpen = false
  }

  @action
  authenticate(){
    this.authenticating = true
    return request.post('/isAuthenticated').then((res)=>{
      this.authenticating = false
      return this.user=res.body
    }).catch(err=>{
      console.error(err)
      this.authenticating = false
    })
  }
}
