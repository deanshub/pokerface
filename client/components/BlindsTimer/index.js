import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Dimmer from '../basic/Dimmer'
import Button, {ButtonGroup} from '../basic/Button'
import Image from '../basic/Image'

import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import './fullscreen-api-polyfill.min'
import BlindsTimerSettingsModal from './BlindsTimerSettingsModal'
import BlindTimerResetModal from './BlindTimerResetModal'
import logo from '../../assets/blue logo.png'
import resetSvg from '../../assets/blindstimer/reset-bt.svg'
import backSvg from '../../assets/blindstimer/back-bt.svg'
import forwardSvg from '../../assets/blindstimer/forward-bt.svg'
import pauseSvg from '../../assets/blindstimer/pause-bt.svg'
import playSvg from '../../assets/blindstimer/play-bt.svg'
import invertBrightSvg from '../../assets/blindstimer/sun.svg'
import invertDarkSvg from '../../assets/blindstimer/moon.svg'
import settingsSvg from '../../assets/blindstimer/cog.svg'
import fullscreenSvg from '../../assets/blindstimer/expand.svg'
import unFullscreenSvg from '../../assets/blindstimer/collapse.svg'

@inject('timer')
@observer
export default class BlindsTimer extends Component {
  static propTypes = {
    image: PropTypes.string,
    timer: PropTypes.shape(),
    title: PropTypes.string,
  }
  static defaultProps = {
    title: 'Pokerface.io',
    image: logo,
  }

  componentDidMount(){
    const {timer} = this.props
    timer.settingsModalMountNode = ReactDOM.findDOMNode(this)
    timer.resetModalMountNode = ReactDOM.findDOMNode(this)
    timer.startSubscription()
  }

  resetTimer(){
    const {timer} = this.props
    timer.start()
  }

  pauseTimer(){
    const {timer} = this.props
    timer.pause()
  }

  resumeTimer(){
    const {timer} = this.props
    timer.startOrResume()
  }

  previousRound(){
    const {timer} = this.props
    if (timer.round>1){
      timer.setRound(timer.round-1)
    }
  }

  nextRound(){
    const {timer} = this.props
    timer.setRound(timer.round+1)
  }

  toggleInverted(){
    const {timer} = this.props
    timer.inverted = !timer.inverted
  }

  toggleFullscreen(){
    if (!document.fullscreenElement) {
      ReactDOM.findDOMNode(this).parentElement.parentElement.parentElement.parentElement.requestFullscreen()
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  openSettingsModal(){
    const {timer} = this.props
    timer.settingsModalOpen = true
  }

  buildBlindsElement(currentRound){
    let anteElement
    if (currentRound.ante){
      anteElement=(
        <div>
          <div>
            Ante
          </div>
          <div className={classnames(style.blindContent)}>
            {currentRound.ante}
          </div>
        </div>
      )
    }
    let sbElement
    if (currentRound.smallBlind){
      sbElement=(
        <div>
          <div>
            Small Blind
          </div>
          <div className={classnames(style.blindContent)}>
            {currentRound.smallBlind}
          </div>
        </div>
      )
    }
    let bbElement
    if (currentRound.bigBlind){
      bbElement=(
        <div>
          <div>
            Big Blind
          </div>
          <div className={classnames(style.blindContent)}>
            {currentRound.bigBlind}
          </div>
        </div>
      )
    }

    const slashElement = (
      <div className={classnames(style.slash, style.blindContent)}>
        /
      </div>
    )

    return (
      <div className={classnames(style.blinds)}>
        {anteElement}
        {
          anteElement&&sbElement?
          slashElement
          :null
        }
        {sbElement}
        {
          sbElement&&bbElement?
          slashElement
          :null
        }
        {
          anteElement&&bbElement&&!sbElement?
          slashElement
          :null
        }
        {bbElement}
      </div>
    )
  }

  render(){
    const {timer, title, image} = this.props
    return (
      <Dimmer
          busy={timer.loading}
          className={classnames(style.fullScreen)}
          label="Loading"
      >
          <BlindTimerResetModal/>
          <BlindsTimerSettingsModal/>
          <ButtonGroup
              center
              horizontal
              noEqual
              style={{width:'100%', marginBottom: '2em'}}
          >
            <Button
                name="reset"
                onClick={::this.resetTimer}
            >
              <img
                  aria-hidden
                  src={resetSvg}
              />
            </Button>
            <Button
                name="play"
                onClick={timer.paused ? ::this.resumeTimer : ::this.pauseTimer}
            >
              <img
                  aria-hidden
                  src={timer.paused ? playSvg : pauseSvg}
              />
            </Button>
            <Button
                disable={timer.round <= 1}
                name="back"
                onClick={::this.previousRound}
            >
              <img
                  aria-hidden
                  src={backSvg}
              />
            </Button>
            <Button
                name="back"
                onClick={::this.nextRound}
            >
              <img
                  aria-hidden
                  src={forwardSvg}
              />
            </Button>
            <Button
                name="invert"
                onClick={::this.toggleInverted}
            >
              <img
                  aria-hidden
                  src={timer.inverted?invertDarkSvg:invertBrightSvg}
              />
            </Button>
            <Button
                name="settings"
                onClick={::this.openSettingsModal}
            >
              <img
                  aria-hidden
                  src={settingsSvg}
              />
            </Button>
            <Button
                name="fullscreen"
                onClick={::this.toggleFullscreen}
            >
              <img
                  aria-hidden
                  src={document.fullscreenElement?unFullscreenSvg:fullscreenSvg}
              />
            </Button>
          </ButtonGroup>
          <div className={style.round}>
            Round {timer.round}
          </div>
          <div className={style.time}>
            {timer.timeLeft}
          </div>

          <div className={style.progress} style={{width: `${timer.precentageComplete}%`}}/>
          <div className={style.brandLine}>
            <div className={style.brand}>
              <Image
                  className={style.brandImage}
                  src={image}
                  style={{marginRight:'none'}}
              />
              {title}
            </div>
          </div>

          <div className={style.blindsContainer}>
            <div className={style.currentBlinds}>
              {
                timer.currentRound.type==='break'
                ?
                'Break'
                :
                this.buildBlindsElement(timer.currentRound)
              }
            </div>
            <div className={style.nextBlinds}>
              {timer.nextBlinds}
            </div>
          </div>
        </Dimmer>
    )
  }
}
