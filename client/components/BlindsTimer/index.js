import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Button, Header, Progress, Icon, Checkbox, Image } from 'semantic-ui-react'
import Dimmer from '../basic/Dimmer'

import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import './fullscreen-api-polyfill.min'
import BlindsTimerSettingsModal from './BlindsTimerSettingsModal'
import BlindTimerResetModal from './BlindTimerResetModal'
import logo from '../../assets/blue logo.png'

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
      ReactDOM.findDOMNode(this).parentElement.parentElement.parentElement.parentElement.requestFullscreen()
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
    const {timer, title, image} = this.props
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
            style={{fontSize:'20vmin', margin:0, lineHeight:0.8}}
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
      <Dimmer
          busy={timer.loading}
          className={classnames(style.fullScreen)}
          label="Loading"
      >
        <BlindTimerResetModal/>
        <BlindsTimerSettingsModal/>

        <div
            className={classnames(style.redesign)}
            stretched
            style={{backgroundColor:!inverted?'white':undefined, paddingTop:25}}
        >
          <div style={{width:'30%'}}>
            <Header
                color="grey"
                inverted={inverted}
                style={{textAlign:'left', paddingLeft:'2vw'}}
            >
              Round {timer.round}
            </Header>
          </div>
          <div style={{width:'38%', textAlign:'center'}}>
            <Image
                centered
                size="mini"
                src={image}
            />
            <Header inverted={inverted} style={{textDecoration: 'underline'}}>{title}</Header>
          </div>
          <div
              style={{
                paddingRight:'2%',
                width: '30%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
          >
            <Button.Group
                basic={!inverted}
                color={inverted?'black':undefined}
                compact
                icon
                inverted={inverted}
                style={{width:'100%'}}
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
          </div>

          <div style={{textAlign:'center', width:'100%', display:'flex', maxHeight:'50vh'}}>
            <Header inverted={inverted} style={{fontSize:'35vmin', flex:1, lineHeight: 'normal'}}>{timer.timeLeft}</Header>
          </div>

          <div style={{textAlign:'center', width:'100%', verticalAlign:'top'}}>
            <Progress
                color="red"
                inverted={inverted}
                percent={timer.precentageComplete}
                size="tiny"
                style={{margin:0}}
            />
          </div>

          <div style={{textAlign:'center', width:'44%'}}>
            <Header color="grey" inverted={inverted}>Blinds</Header>
            <Header inverted={inverted} style={{fontSize:'20vmin', margin:0, lineHeight:0.8}}>{timer.blinds}</Header>
            <Header inverted={inverted}>{timer.nextBlinds}</Header>
          </div>
          <div
              style={{
                textAlign:'center',
                verticalAlign:'middle',
                width:'12%',
                display:'flex',
                flexDirection:'column',
              }}
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
          </div>
          <div style={{textAlign:'center', width:'44%'}}>
            {
              anteSection
            }
          </div>
        </div>
      </Dimmer>
    )
  }
}
