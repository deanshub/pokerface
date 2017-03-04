// @flow

import { observable, action } from 'mobx'
import * as ProfileConsts from '../constants/profile'

export class ProfileStore {
  @observable currentTab: string

  constructor(){
    this.currentTab = ProfileConsts.ADD_PLAY_TAB
  }

  @action
  changeTab(tab: string): void{
    this.currentTab = tab
  }
}
