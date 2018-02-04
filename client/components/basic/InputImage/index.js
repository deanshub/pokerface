import React, { Component } from 'react'
import Loader from '../Loader'
import classnames from 'classnames'
import style from './style.css'

export default class InputImage extends Component {

  onSelectImage(){
    const {onSelect} = this.props
    onSelect(this.imageElm.files[0])
  }

  selectImage(event){
    event.preventDefault()
    this.imageElm.click()
  }


  render(){
    const {
      label,
      src,
      loading,
    } = this.props

    const backgroundImage = src?{backgroundImage:`url(${src})`}:null
    return(
      <div className={classnames(style.field)}>
        <label className={classnames(style.label)}>
          {label}
          {src && <span className={classnames(style.changePhoto)} onClick={::this.selectImage}>Change</span>}
        </label>
        <input
            onChange={::this.onSelectImage}
            ref={(imageElm)=>this.imageElm=imageElm}
            style={{display:'none'}}
            type="file"
        />
        <div className={classnames(style.imageContainer)} style={backgroundImage}>
          {!src &&
            <div className={classnames(style.selectPhoto)} onClick={::this.selectImage}>
              Select Photo
            </div>
          }
          {loading && <Loader/>}
        </div>
      </div>
    )
  }
}
