// @flow

import { observable } from 'mobx'

export class AuthStore {
  @observable user
  @observable opensourceModalOpen: boolean

  constructor(){
    const coverImage = 'poker-1999643.jpg'

    this.user = {
      user:'deanshub',
      displayName: 'Dean Shub',
      coverImage,
      // coverImage: 'cover.jpg',
      avatarImage: 'dean2.jpg',
    }
    this.opensourceModalOpen = false
  }
}
