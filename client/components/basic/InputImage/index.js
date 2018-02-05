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
        </label>
        <input
            accept="image/*"
            onChange={::this.onSelectImage}
            ref={(imageElm)=>this.imageElm=imageElm}
            style={{display:'none'}}
            type="file"
        />
        <div
            className={classnames(style.imageContainer)}
            onClick={::this.selectImage}
            style={backgroundImage}
        >
          <div className={classnames(style.selectPhoto)} >
            {src?'Change':'Select Photo'}
          </div>
          {loading && <Loader/>}
        </div>
      </div>
    )
  }
}
