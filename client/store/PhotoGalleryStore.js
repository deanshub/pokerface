// @flow

import { observable, action } from 'mobx'

export class PhotoGalleryStore {
  @observable photos: string[]
  @observable open: boolean
  @observable photoIndex

  constructor(){
    this.photos = []
    this.open = false
    this.photoIndex = 0
  }

  @action
  openModal(photos, photoIndex=0){
    this.photos = photos
    this.open = true
    this.photoIndex = photoIndex
  }

  @action
  nextPhoto(){
    this.photoIndex++
    if (this.photoIndex>=this.photos.length){
      this.photoIndex=0
    }
  }
}
