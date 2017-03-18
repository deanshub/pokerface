import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Grid, Button, Header, Progress, Icon } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import './fullscreen-api-polyfill.min'
import BlindsTimerSettingsModal from './BlindsTimerSettingsModal'

@inject('timer')
@observer
export default class BlindsTimer extends Component {
  static propTypes ={
  }

  componentWillUnmount(){
    this.pauseTimer()
  }

  resetTimer(){
    const {timer} = this.props
    this.pauseTimer()
    timer.start()
  }

  startTimer(){
    const {timer} = this.props
    clearInterval(this.interval)
    timer.start()
    this.interval = setInterval(()=>{
      timer.updateTimer()
    }, 1000)
  }

  pauseTimer(){
    const {timer} = this.props
    timer.pause()
    clearInterval(this.interval)
  }

  resumeTimer(){
    const {timer} = this.props
    clearInterval(this.interval)
    timer.startOrResume()
    this.interval = setInterval(()=>{
      timer.updateTimer()
    }, 1000)
  }

  toggleFullscreen(){
    if (!document.fullscreenElement) {
      ReactDOM.findDOMNode(this).requestFullscreen()
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

  render() {
    const {timer} = this.props

    return (
      <Grid className={classnames(style.fullScreen)} padded>
        <BlindsTimerSettingsModal />

        <Grid.Row color="black" stretched>
          <Grid.Column width={3}>
            <Header inverted>Pokerface.io</Header>
          </Grid.Column>
          <Grid.Column textAlign="center" width={11}>
            <Header color="grey" inverted>Round {timer.round}</Header>
          </Grid.Column>
          <Grid.Column
              textAlign="right"
              verticalAlign="top"
              width={2}
          >
            <Button
                inverted
                onClick={::this.openSettingsModal}
            >
              <Icon name="setting"/>
            </Button>
          </Grid.Column>

          <Grid.Column textAlign="center" width={16}>
            <Header inverted style={{fontSize:'25vw', margin:0}}>{timer.timeLeft}</Header>
          </Grid.Column>

          <Grid.Column
              textAlign="center"
              verticalAlign="top"
              width={16}
          >
            <Progress
                color="red"
                inverted
                percent={timer.precentageComplete}
                size="tiny"
            />
          </Grid.Column>

          <Grid.Column textAlign="center" width={6}>
            <Header color="grey" inverted>Blinds</Header>
            <Header inverted style={{fontSize:'9vw', margin:0}}>{timer.blinds}</Header>
            <Header inverted>{timer.nextBlinds}</Header>
          </Grid.Column>
          <Grid.Column width={1}/>
          <Grid.Column
              textAlign="center"
              verticalAlign="middle"
              width={2}
          >
            {
              timer.paused?
              <Button
                  circular
                  inverted
                  onClick={::this.resumeTimer}
                  size="large"
              >
                <Icon name="play"/>
              </Button>
              :
              <Button
                  circular
                  inverted
                  onClick={::this.pauseTimer}
                  size="large"
              >
                <Icon name="pause"/>
              </Button>
            }

            {/*
              <Button onClick={::this.startTimer}>Start</Button>
              <Button onClick={::this.resetTimer}>Reset</Button>
            */}
          </Grid.Column>
          <Grid.Column textAlign="center" width={6}>
            <Header color="grey" inverted>Ante</Header>
            <Header inverted style={{fontSize:'9vw', margin:0}}>{timer.ante}</Header>
            <Header inverted>{timer.nextAnte}</Header>
          </Grid.Column>
          <Grid.Column
              textAlign="right"
              verticalAlign="bottom"
              width={1}
          >
            <Button inverted onClick={::this.toggleFullscreen}>
              <Icon name="expand" />
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
