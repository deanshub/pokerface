import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Video extends Component {

  render(){

    const {autoplay, className, controls, src, type} = this.props

    return (
      <div className={classnames(className, style.container, {[style.unControled]:!controls})} >
        <video
            autoPlay={autoplay}
            className={classnames(style.video)}
            controls={controls}
        >
         <source src={src} type={type}/>
       </video>
     </div>
    )
  }
}
