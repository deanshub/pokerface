import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Video extends Component {

  render(){

    const {autoplay, className, controls, src, type} = this.props

    return (
      <div className={classnames(className, style.container, {[style.unControled]:!controls})} >
        <video
            autoplay={autoplay}
            className={classnames(style.video)}
            controls={controls}
        >
         <source src={src} type={type}/>
       </video>
     </div>
    )
    // return (
    //   <ReactVideo
    //       className={className}
    //       controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
    //       onCanPlayThrough={() => {
    //           // Do stuff
    //       }}
    //       poster="http://sourceposter.jpg"
    //   >
    //       <source src={src} type={type} />
    //       <track
    //           default
    //           kind="subtitles"
    //           label="English"
    //           src="http://source.vtt"
    //           srcLang="en"
    //       />
    //   </ReactVideo>
    // )
  }
}
