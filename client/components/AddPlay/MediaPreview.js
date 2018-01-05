import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'

@inject('feed')
@observer
export default class AddPlay extends Component {

  deletePhoto(name){
    const {feed} = this.props
    feed.deletePreviewUploadMedia(name)
  }

  render(){
    const {feed} = this.props

    if (feed.previewUploadedMedia.length<=0){
      return null
    }

    return (
      <div className={classnames(style.imagesContainer)}>
        {
          feed.previewUploadedMedia.map(({name, type, src})=>{

            let filePreview
            if (type.startsWith('video')){
              filePreview = <video className={classnames(style.image)}>
                <source src={src} type={type}/>
             </video>
            // then image
            }else{
              filePreview = <img className={classnames(style.image)} src={src}/>
            }

            return <div className={classnames(style.imagePreview)} key={name}>
              {filePreview}
              <div className={classnames(style.imagePreviewOverlay)}>
                <div
                  className={classnames(style.deleteImage)}
                  onClick={() => {this.deletePhoto(name)}}
                />
              </div>
           </div>
          })
        }
        {feed.uploadingMedia && <div>loading</div>}
      </div>
    )
  }
}
