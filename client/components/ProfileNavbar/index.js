// @flow

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { Menu, Segment, Icon, Image } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

import * as ProfileConsts from '../../constants/profile'
import Statistics from '../Statistics'
import AddGame from '../AddGame'
import AddPlay from '../AddPlay'
import BlindsTimer from '../BlindsTimer'
import Lern from '../Lern'
import UnavailableSection from '../UnavailableSection'
import style from './style.css'

@inject('profile')
@observer
export default class ProfileNavbar extends Component {
  static propTypes = {
    avatar: PropTypes.string,
  }

  constructor(props: Object){
    super(props)
    this.state = {
      avatarImage: undefined,
    }
  }

  state: { avatarImage?: string }

  componentDidMount(){
    const {avatar} = this.props

    // System.import(`../../assets/images/${avatar}`).then(avatarImage=>{
    import(`../../assets/images/${avatar}`).then(avatarImage=>{
      this.setState({
        avatarImage,
      })
    })
  }

  getCurrentTab(currentTab: string){
    if (currentTab===ProfileConsts.STATISTICS_TAB){
      return <Statistics />
    }else if (currentTab===ProfileConsts.ADD_GAME_TAB) {
      return <AddGame />
    }else if (currentTab===ProfileConsts.LEARN) {
      return <Lern/>
    }else if (currentTab===ProfileConsts.BLINDS_TIMER) {
      return <BlindsTimer/>
    }else if (currentTab===ProfileConsts.ADD_PLAY_TAB) {
      return <AddPlay />
    }else{
      return <UnavailableSection/>
    }
  }

  render() {
    const {profile} = this.props
    const {avatarImage}: {avatarImage?: string} = this.state
    const {currentTab} = profile

    return (
      <div>
        <Menu
            attached="top"
            icon="labeled"
            tabular
            widths={5}
        >
          <Menu.Item
              active={currentTab===ProfileConsts.ADD_GAME_TAB}
              onClick={()=>profile.changeTab(ProfileConsts.ADD_GAME_TAB)}
          >
            <Icon name="gamepad" />
            Game
          </Menu.Item>
          <Menu.Item
              active={currentTab===ProfileConsts.LEARN}
              onClick={()=>profile.changeTab(ProfileConsts.LEARN)}
          >
            <Icon name="student" />
            Learn
          </Menu.Item>
          <Menu.Item
              active={currentTab===ProfileConsts.STATISTICS_TAB}
              onClick={()=>profile.changeTab(ProfileConsts.STATISTICS_TAB)}
              style={{maxHeight:74}}
          >
            <Image
                avatar
                className={classnames(style.avatar)}
                size="tiny"
                src={avatarImage}
            />
          </Menu.Item>
          <Menu.Item
              active={currentTab===ProfileConsts.BLINDS_TIMER}
              onClick={()=>profile.changeTab(ProfileConsts.BLINDS_TIMER)}
          >
            <Icon name="clock" />
            Blinds Timer
          </Menu.Item>
          <Menu.Item
              active={currentTab===ProfileConsts.ADD_PLAY_TAB}
              onClick={()=>profile.changeTab(ProfileConsts.ADD_PLAY_TAB)}
          >
            <Icon name="share alternate" />
            Post
          </Menu.Item>
        </Menu>
        <Segment attached="bottom">
          {this.getCurrentTab(currentTab)}
        </Segment>
      </div>
    )
  }
}
