// @flow

import { observable, action } from 'mobx'

export class PhotoGalleryStore {
  @observable photos: string[]
  @observable open: boolean

  constructor(){
    this.photos = []
    this.open = false
  }

  @action
  openModal(photos){
    this.photos = photos
    this.open = true
  }
}
