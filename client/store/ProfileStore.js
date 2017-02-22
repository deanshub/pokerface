import { observable, action } from 'mobx'
import * as ProfileConsts from '../constants/profile'

export class ProfileStore {
  @observable currentTab

  constructor(){
    this.currentTab = ProfileConsts.ADD_PLAY_TAB
  }

  @action changeTab(tab){
    this.currentTab = tab
  }
}
