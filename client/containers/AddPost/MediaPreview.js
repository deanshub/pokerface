import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Loader from '../../components/basic/Loader'
import Video from '../../components/basic/Video'
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

            return (
              <div className={classnames(style.imagePreview)} key={name}>
                {
                  type.startsWith('video')?
                    <Video
                        className={classnames(style.image)}
                        src={src}
                        type={type}
                    />
                  :
                    <img className={classnames(style.image)} src={src}/>
                }
                <div className={classnames(style.imagePreviewOverlay)}>
                  <div
                      className={classnames(style.deleteImage)}
                      onClick={() => {this.deletePhoto(name)}}
                  />
                </div>
              </div>
            )
          })
        }
        {feed.uploadingMedia && <Loader small/>}
      </div>
    )
  }
}
