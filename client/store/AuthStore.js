// @flow

import { observable } from 'mobx'

export class AuthStore {
  @observable user
  @observable opensourceModalOpen: boolean

  constructor(){
    this.user = {
      user:'deanshub',
      displayName: 'Dean Shub',
      coverImage: 'cover.jpg',
      avatarImage: 'dean2.jpg',
    }
    this.opensourceModalOpen = false
  }
}
