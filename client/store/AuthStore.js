import { observable, action } from 'mobx'

export class AuthStore {
  @observable user

  constructor(){
    this.user = {
      user:'deanshub',
      displayName: 'Dean Shub',
      coverImage: 'cover.jpg',
      avatarImage: 'dean2.jpg',
    }
  }
}
