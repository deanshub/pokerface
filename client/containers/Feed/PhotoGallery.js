// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Video from '../../components/basic/Video'
import Modal from '../../components/basic/Modal'
import Button from '../../components/basic/Button'

import classnames from 'classnames'
import style from './style.css'

@inject('photoGallery')
@observer
export default class PhotoGallery extends Component {
  render() {
    const { photoGallery } = this.props

    const onlyOnePhoto = photoGallery.photos.length===1

    const photo = photoGallery.photos[photoGallery.photoIndex]
    return (
      <Modal
          closeOnBlur
          onClose={()=>{photoGallery.open=false}}
          open={photoGallery.open}
      >
        <div className={classnames(style.galleryContainer)}>
          <Button
              disabled={onlyOnePhoto}
              leftIcon="previous"
              onClick={()=>photoGallery.previousPhoto()}
          />
          {/* <Image
              className={classnames(style.clickable)}
              draggable={false}
              fluid
              src={photoGallery.photos[photoGallery.photoIndex]}
          /> */}
          { photo &&
            (photo.type.startsWith('video')?
              <Video
                  autoplay
                  className={classnames(style.galleryImage)}
                  controls
                  src={photo.path} type={photo.type}
              />
            :
              <img className={classnames(style.galleryImage)} draggable={false} src={photo.path}/>)
          }
          <Button
              disabled={onlyOnePhoto}
              leftIcon="next"
              onClick={()=>photoGallery.nextPhoto()}
          />
        </div>
      </Modal>
    )
  }
}
