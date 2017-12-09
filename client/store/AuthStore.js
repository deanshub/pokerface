// @flow

import { observable, action } from 'mobx'
import request from 'superagent'
import { close } from './graphqlClient'
import logger from '../utils/logger'
import {deleteCookie, getCookieByName} from '../utils/cookies'

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

      const {user} = res.body

      logger.setField({user:user.username, email:user.email})

      const cookieJwt = getCookieByName('jwt')
      if (cookieJwt !== null){
        localStorage.setItem('jwt',cookieJwt)
        deleteCookie('jwt')
      }

      return this.user=user
    }).catch(err=>{
      console.error(err)
      this.authenticating = false
    })
  }

  @action
  switchToOrganization(organization){
    this.authenticating = true
    const {id:organizationId} = organization
    return request.post('/login/switchToOrganization').send({organizationId}).set('Authorization', localStorage.getItem('jwt')).then((res)=>{
      this.authenticating = false

      const {token} = res.body
      localStorage.setItem('jwt',token)
    }).catch(err=>{
      console.error(err)
      this.authenticating = false
    })
  }

  @action
  logout(){
    logger.logEvent({category:'User',action:'Logout'})
    this.user = {}
    close()
  }

  @action
  refesh(){
    this.authenticate()
  }
}
