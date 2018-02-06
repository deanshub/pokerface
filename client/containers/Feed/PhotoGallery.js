// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import Video from '../../components/basic/Video'
import Modal from '../../components/basic/Modal'
import Slider from '../../components/basic/Slider'

@inject('photoGallery')
@observer
export default class PhotoGallery extends Component {
  render() {
    const { photoGallery } = this.props

    const items = photoGallery.photos.map((photo, index) => {
      return (
        photo.type.startsWith('video')?
          <Video
              autoplay={index===photoGallery.photoIndex}
              controls
              key={index}
              src={photo.path} type={photo.type}
          />
        :
        <img
            draggable={false}
            key={index}
            src={photo.path}
        />
      )
    })
    return (
      <Modal
          closeOnBlur
          inverted
          onClose={()=>{photoGallery.open=false}}
          open={photoGallery.open}
          showCloseButton
          simple
      >
        <Slider displayItemIndex={photoGallery.photoIndex}>
          {items}
        </Slider>
      </Modal>
    )
  }
}
