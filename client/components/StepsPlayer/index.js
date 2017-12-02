import React, { Component, PropTypes } from 'react'
import { Form, Input, Menu, Icon } from 'semantic-ui-react'

import classnames from 'classnames'
import style from './style.css'


export default class StepsPlayer extends Component {
  static propTypes = {
    hasNextStep: PropTypes.bool,
    onNextStep: PropTypes.func.isRequired,
    onPreviousStep: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
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
    } = this.props
    const {speed, auto} = this.state

    return (
      <Menu>
        <Menu.Item>
          <Form.Field className={classnames(style.stepsSpeed)} inline>
            <label>Speed:</label>
            <Input
                max={2}
                min={0.25}
                name="speed"
                onChange={::this.speedChange}
                step={0.25}
                type="range"
                value={speed}
            />
            <label style={{width:'3vw'}}>{`X${speed}`}</label>
          </Form.Field>
        </Menu.Item>

        <Menu.Item
            disabled
            name="back"
            onClick={onPreviousStep}
        >
          <Icon name="left chevron" />Back
        </Menu.Item>
        <Menu.Item
            name="reset"
            onClick={::this.reset}
        >
          <Icon
              flipped="horizontally"
              name="repeat"
          />
          Reset
        </Menu.Item>
        {
          auto?
          <Menu.Item
              name="pause"
              onClick={::this.pauseAutoPlay}
          >
            <Icon name="pause" />
            Pause
          </Menu.Item>
          :
          <Menu.Item
              name="play"
              onClick={::this.autoPlay}
          >
            <Icon name="play" />
            Play
          </Menu.Item>
        }
        <Menu.Item
            disabled={!hasNextStep}
            name="forward"
            onClick={onNextStep}
        >
          Forward
          <Icon name="right chevron" />
        </Menu.Item>
      </Menu>
    )
  }
}
