import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import BlindsTimer from '../../components/BlindsTimer'
import YouTube from '../../components/YouTube'
import Slider from '../../components/basic/Slider'
import WidthGetter from '../../components/basic/WidthGetter'

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

    if (user.rebranding){
      image = user.avatar
      title = user.fullname
    }
    return (
      <Slider style={{height:'89vh', backgroundColor:'black'}}>
        <BlindsTimer image={image} title={title}/>
        <WidthGetter render={this.renderYoutube}/>
      </Slider>
    )
  }

}
