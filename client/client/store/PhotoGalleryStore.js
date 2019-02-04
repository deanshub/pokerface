// @flow

import { observable, action } from 'mobx'
import logger from '../utils/logger'

export class PhotoGalleryStore {
  @observable photos
  @observable open: boolean
  @observable photoIndex

  constructor(){
    this.photos = []
    this.open = false
    this.photoIndex = 0
  }

  @action
  openModal(photos, photoIndex=0){
    logger.logEvent({category:'Photo Gallery',action:'open'})
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

  @action
  previousPhoto(){
    this.photoIndex--
    if (this.photoIndex<0){
      this.photoIndex=this.photos.length-1
    }
  }
}
