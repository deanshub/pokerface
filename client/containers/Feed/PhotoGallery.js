// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Image, Modal } from 'semantic-ui-react'
import classnames from 'classnames'
import style from './style.css'

@inject('photoGallery')
@observer
export default class PhotoGallery extends Component {
  render() {
    const { photoGallery } = this.props

    return (
      <Modal
          dimmer="blurring"
          onClose={()=>{photoGallery.open=false}}
          open={photoGallery.open}
      >
        <Image
            className={classnames(style.clickable)}
            draggable={false}
            fluid
            onClick={()=>photoGallery.nextPhoto()}
            src={photoGallery.photos[photoGallery.photoIndex]}
        />
      </Modal>
    )
  }
}
