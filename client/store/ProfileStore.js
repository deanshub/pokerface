// @flow

import { observable, action } from 'mobx'
import * as ProfileConsts from '../constants/profile'
import graphqlClient from './graphqlClient'
import {usersQuery} from './queries/users'
import {updatePersonalInfoMutation} from './mutations/users'

export class ProfileStore {
  @observable currentTab: string
  @observable currentUser: Object

  constructor(){
    this.currentTab = ProfileConsts.STATISTICS_TAB
    this.currentUser = observable({})
  }

  @action
  changeTab(tab: string): void{
    this.currentTab = tab
  }

  @action
  setCurrentUser(user): void{
    if (typeof user === 'string'){
      graphqlClient.query({query: usersQuery, variables: {username:user}}).then((result)=>{
        const user = result.data.users[0]
        this.currentUser = observable(user)
      })
    }else{
      this.currentUser = observable(user)
    }
  }

  updatePersonalInfo(info): void{
    return graphqlClient.mutate({mutation: updatePersonalInfoMutation, variables: info}).then(res=>res.data.updatePersonalInfo)
  }
}
