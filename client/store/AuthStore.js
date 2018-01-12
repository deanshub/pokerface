// @flow

import { observable, action, computed } from 'mobx'
import request from 'superagent'
import { close } from './graphqlClient'
import logger from '../utils/logger'
import {deleteCookie, getCookieByName} from '../utils/cookies'
import {CREATE_PUBLIC_EVENT} from '../utils/permissions'
import {optionalUsersSwitchQuery, optionalUsersLoginQuery} from './queries/users'
import graphqlClient from './graphqlClient'

export class AuthStore {
  @observable token
  @observable user
  @observable optionalUsers
  @observable opensourceModalOpen: boolean
  @observable modalModalOpen: boolean
  @observable authenticating: boolean
  @observable fetchOptionalUsers: boolean

  constructor(){
    this.user = {}
    this.authenticating = true
    this.fetchOptionalUsers = true
    this.opensourceModalOpen = false
    this.modalModalOpen = false
    this.optionalUsers = observable([])
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

      this.moveCookieJwtToLocalStorage()

      return this.user=user
    }).catch(err=>{
      console.error(err)
      this.authenticating = false
    })
  }

  @action
  switchToUser(userId){
    this.moveCookieJwtToLocalStorage()

    this.authenticating = true
    return request.post('/login/switchToUser').send({userId}).set('Authorization', localStorage.getItem('jwt')).then((res)=>{
      graphqlClient.resetStore()
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
    graphqlClient.resetStore()
    this.user = {}
    close()
  }

  @action
  refresh(){
    this.authenticating = true
    this.fetchOptionalUsers = true
    this.optionalUsers = observable([])
    return this.authenticate()
  }

  @action
  fetchOptionalUsersSwitch(){
    this.fetchOptionalUsers = true
    return graphqlClient.query({query:optionalUsersSwitchQuery}).then((result) =>{
      this.optionalUsers = result.data.optionalUsersSwitch
      this.fetchOptionalUsers = false
      return this.optionalUsers
    })
  }

  @action
  fetchOptionalUsersLogin(){
    this.fetchOptionalUsers = true
    return graphqlClient.query({query:optionalUsersLoginQuery}).then((result) =>{
      this.optionalUsers = result.data.optionalUsersLogin
      this.fetchOptionalUsers = false
      return this.optionalUsers
    })
  }

  @computed
  get publicEventPermission(){
    const {permissions} = this.user
    return permissions && permissions.includes(CREATE_PUBLIC_EVENT)
  }

  // When login from facebook and google plus the jwt is put in the cookies
  // and we need to move it to local store
  moveCookieJwtToLocalStorage(){
    const cookieJwt = getCookieByName('jwt')
    if (cookieJwt !== null){
      localStorage.setItem('jwt',cookieJwt)
      deleteCookie('jwt')
    }
  }
}
