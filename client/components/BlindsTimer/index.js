import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Grid, Button, Header, Progress, Icon, Checkbox, Dimmer, Loader } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import './fullscreen-api-polyfill.min'
import BlindsTimerSettingsModal from './BlindsTimerSettingsModal'
import BlindTimerResetModal from './BlindTimerResetModal'

@inject('timer')
@observer
export default class BlindsTimer extends Component {
  static propTypes ={
    timer: PropTypes.shape(),
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
    timer.setRound(timer.round-1)
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
    const {timer} = this.props
    const inverted = timer.inverted

    if (!document.fullscreenElement) {
      if (!inverted){
        this.toggleInverted()
      }
      ReactDOM.findDOMNode(this).requestFullscreen()
    } else {
      if (document.exitFullscreen) {
        if (inverted){
          this.toggleInverted()
        }
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
    const inverted = timer.inverted

    const anteSection =
      timer.ante || timer.nextAnte ?[
        <Header
            color="grey"
            inverted={inverted}
            key="1"
        >
          Ante
        </Header>,
        <Header
            inverted={inverted}
            key="2"
            style={{fontSize:'9vw', margin:0, lineHeight:0.8}}
        >
          {timer.ante||'0'}
        </Header>,
        <Header
            inverted={inverted}
            key="3"
        >
          {timer.nextAnte}
        </Header>,
      ]
      :
      null

    return (
      <Dimmer.Dimmable
          as={Grid}
          className={classnames(style.fullScreen)}
          dimmed={timer.loading}
          stretched
      >
       <Dimmer active={timer.loading} inverted>
         <Loader>Loading</Loader>
       </Dimmer>

        <BlindTimerResetModal/>
        <BlindsTimerSettingsModal/>

        <Grid.Row
            color={inverted?'black':undefined}
            stretched
            style={{backgroundColor:!inverted?'white':undefined, paddingTop:25}}
        >
          <Grid.Column width={5}>
            <Header inverted={inverted} style={{textDecoration: 'underline'}}>Pokerface.io</Header>
          </Grid.Column>
          <Grid.Column textAlign="center" width={6}>
            <Header color="grey" inverted={inverted}>Round {timer.round}</Header>
          </Grid.Column>
          <Grid.Column
              style={{ paddingRight:20 }}
              textAlign="center"
              verticalAlign="top"
              width={5}
          >
            <Button.Group
                basic={!inverted}
                color={inverted?'black':undefined}
                compact
                icon
                inverted={inverted}
            >
              <Button onClick={::this.toggleInverted}>
                <Checkbox
                    checked={inverted}
                    toggle
                />
              </Button>
              <Button onClick={::this.openSettingsModal}>
                  <Icon name="setting"/>
              </Button>
              <Button onClick={::this.toggleFullscreen}>
                <Icon name="expand"/>
              </Button>
            </Button.Group>
          </Grid.Column>

          <Grid.Column textAlign="center" width={16}>
            <Header inverted={inverted} style={{fontSize:'25vw', margin:0, lineHeight:1}}>{timer.timeLeft}</Header>
          </Grid.Column>

          <Grid.Column
              textAlign="center"
              verticalAlign="top"
              width={16}
          >
            <Progress
                color="red"
                inverted={inverted}
                percent={timer.precentageComplete}
                size="tiny"
            />
          </Grid.Column>

          <Grid.Column textAlign="center" width={6}>
            <Header color="grey" inverted={inverted}>Blinds</Header>
            <Header inverted={inverted} style={{fontSize:'9vw', margin:0, lineHeight:0.8}}>{timer.blinds}</Header>
            <Header inverted={inverted}>{timer.nextBlinds}</Header>
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
                  icon
                  inverted={inverted}
                  onClick={::this.resumeTimer}
                  size="large"
              >
                <Icon name="play"/>
              </Button>
              :
              <Button
                  circular
                  icon
                  inverted={inverted}
                  onClick={::this.pauseTimer}
                  size="large"
              >
                <Icon name="pause"/>
              </Button>
            }
            <Button.Group
                icon
                inverted={inverted}
                style={{marginTop:100}}
            >
              <Button
                  disabled={timer.round <= 1}
                  inverted={inverted}
                  onClick={::this.previousRound}
              >
                  <Icon name="step backward"/>
              </Button>
              <Button inverted={inverted} onClick={::this.resetTimer}>
                  <Icon flipped="horizontally" name="repeat"/>
              </Button>
              <Button inverted={inverted} onClick={::this.nextRound}>
                <Icon name="step forward"/>
              </Button>
            </Button.Group>
          </Grid.Column>
          <Grid.Column textAlign="center" width={7}>
            {
              anteSection
            }
          </Grid.Column>
        </Grid.Row>
      </Dimmer.Dimmable>
    )
  }
}
