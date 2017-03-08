// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Image, Modal } from 'semantic-ui-react'

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
        <Image fluid src={photoGallery.photos[0]}/>
      </Modal>
    )
  }
}
