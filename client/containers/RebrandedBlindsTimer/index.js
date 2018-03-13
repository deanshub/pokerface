import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import BlindsTimer from '../../components/BlindsTimer'
import YouTube from '../../components/YouTube'
import Slider from '../../components/basic/Slider'
import WidthGetter from '../../components/basic/WidthGetter'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@observer
export default class RebrandedBlindsTimer extends Component {
  renderYoutube(width, height){
    return (
      <YouTube height={height-250} width={width}/>
    )
  }

  render(){
    const {user} = this.props.auth

    let image
    let title

    if (user.rebrandingDetails){
      image = user.avatar
      title = user.fullname
    }
    return (
      <Slider
          className={classnames(style.blindsTimerSlider)}
          style={{backgroundColor:'black', boxShadow:'0 0 10px 0 black'}}
      >
        <BlindsTimer image={image} title={title}/>
        <WidthGetter render={this.renderYoutube}/>
      </Slider>
    )
  }

}
