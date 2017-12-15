import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EventsTimeline from '../EventsTimeline'
import classnames from 'classnames'
import style from './style.css'
import resetSvg from '../../assets/spotplayer/reset.svg'
import playSvg from '../../assets/spotplayer/play.svg'
import pauseSvg from '../../assets/spotplayer/pause.svg'
import backSvg from '../../assets/spotplayer/back.svg'
import forwardSvg from '../../assets/spotplayer/forward.svg'

export default class StepsPlayer extends Component {
  static propTypes = {
    currentStepIndex: PropTypes.number.isRequired,
    hasNextStep: PropTypes.bool,
    onNextStep: PropTypes.func.isRequired,
    onPreviousStep: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    steps: PropTypes.array,
  }

  constructor(props){
    super(props)
    this.state={
      speed: 1,
    }
  }

  componentWillUnmount(){
    this.pauseAutoPlay()
  }

  speedChange(ev, {value}){
    this.setState({
      speed: value,
    })
  }

  pauseAutoPlay(){
    const {auto} = this.state
    if (auto){
      clearTimeout(auto)
    }
    this.setState({
      auto: null,
    })
  }

  autoPlay(){
    const { onNextStep } = this.props
    const {speed, auto} = this.state
    if (auto){
      clearTimeout(auto)
    }

    this.setState({
      auto: setTimeout(()=>{
        if (onNextStep()){
          this.autoPlay()
        }else{
          this.pauseAutoPlay()
        }
      },1000*1/speed),
    })
  }

  x1(){
    this.speedChange(null,{value:1})
    this.autoPlay()
  }
  x2(){
    this.speedChange(null,{value:2})
    this.autoPlay()
  }

  reset(){
    const {onReset} = this.props
    this.pauseAutoPlay()
    onReset()
  }

  render() {
    const {
      onNextStep,
      onPreviousStep,
      hasNextStep,
      steps,
      currentStepIndex,
    } = this.props
    const {speed, auto} = this.state

    return (
      <div className={classnames(style.stepsPlayerContainer)}>
        <div className={classnames(style.actions)}>
          <button
              className={classnames(style.button)}
              name="reset"
              onClick={::this.reset}
          >
            <img
                aria-hidden
                src={resetSvg}
            />
          </button>
          <div className={classnames(style.divider)}/>
          {
            auto?
            <button
                className={classnames(style.button)}
                name="pause"
                onClick={::this.pauseAutoPlay}
            >
              <img
                  aria-hidden
                  src={pauseSvg}
              />
            </button>
            :
            <button
                className={classnames(style.button)}
                name="play"
                onClick={::this.autoPlay}
            >
              <img
                  aria-hidden
                  src={playSvg}
              />
            </button>
          }
          <div className={classnames(style.divider)}/>
          <button
              className={classnames(style.button,{[style.active]:auto&&speed===1})}
              name="play"
              onClick={::this.x1}
          >
            <div className={classnames(style.buttonText)}>
              x1
            </div>
          </button>
          <button
              className={classnames(style.button,{[style.active]:auto&&speed===2})}
              name="play"
              onClick={::this.x2}
          >
            <div className={classnames(style.buttonText)}>
              x2
            </div>
          </button>
          <div className={classnames(style.divider)}/>
          <button
              className={classnames(style.button)}
              name="back"
              onClick={onPreviousStep}
          >
            <img
                aria-hidden
                src={backSvg}
            />
          </button>
          <button
              className={classnames(style.button,{[style.disable]:hasNextStep})}
              name="forward"
              onClick={onNextStep}
          >
            <img
                aria-hidden
                src={forwardSvg}
            />
          </button>
        </div>
        <div className={classnames(style.timeline)}>
          <EventsTimeline
              currentIndex={currentStepIndex}
              events={steps}
              onClick={val => console.log(val)}
          />
        </div>
      </div>
    )
  }
}
