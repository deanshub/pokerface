import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import BlindsTimer from '../../components/BlindsTimer'
import YouTube from '../../components/YouTube'
import TournementManager from '../../components/TournementManager'
import Slider from '../../components/basic/Slider'
import WidthGetter from '../../components/basic/WidthGetter'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('timer')
@observer
export default class RebrandedBlindsTimer extends Component {
  renderYoutube(width, height){
    return (
      <YouTube height={height-250} width={width}/>
    )
  }

  render(){
    const {auth, timer} = this.props
    const {user} = auth

    let image
    let title

    if (user.rebrandingDetails){
      image = user.avatar
      title = user.fullname
    }
    return (
      <Slider
          autoplay={timer.autoSlides.on}
          className={classnames(style.blindsTimerSlider)}
          displayItemsDuration={timer.autoSlides.times.toJS()}
          permanentItems={[0,1,2]}
          style={{backgroundColor:'black', boxShadow:'0 0 10px 0 black'}}
      >
        <BlindsTimer image={image} title={title}/>
        {
          timer.autoSlides.enableYoutube&&
          <WidthGetter render={this.renderYoutube}/>
        }
        {
          timer.tournamentManager.on&&(
            <TournementManager/>
          )
        }
      </Slider>
    )
  }

}
