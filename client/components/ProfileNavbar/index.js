// @flow

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { Menu, Segment, Icon, Image } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

import * as ProfileConsts from '../../constants/profile'
import OnlyLoggedinUser from '../OnlyLoggedinUser'
import Statistics from '../Statistics'
import AddGame from '../AddGame'
import AddPlay from '../AddPlay'
import UnavailableSection from '../UnavailableSection'
import style from './style.css'

@inject('profile')
@observer
export default class ProfileNavbar extends Component {
  constructor(props: Object){
    super(props)
    this.checkStaticNavbarActivation = this.checkStaticNavbarActivation.bind(this)
    this.state = {
      activateFixedNavbar: false,
    }
  }

  state: { activateFixedNavbar: boolean }

  componentDidMount(){
    window.addEventListener('scroll', this.checkStaticNavbarActivation)
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.checkStaticNavbarActivation)
  }

  checkStaticNavbarActivation(){
    const {activateFixedNavbar} = this.state
    if (document.body.scrollTop>190 && !activateFixedNavbar){
      this.setState({
        activateFixedNavbar: true,
      })
    }else if (document.body.scrollTop<=190 && activateFixedNavbar){
      this.setState({
        activateFixedNavbar: false,
      })
    }
  }

  getCurrentTab(currentTab: string){
    if (currentTab===ProfileConsts.STATISTICS_TAB){
      return <Statistics />
    }else if (currentTab===ProfileConsts.ADD_GAME_TAB) {
      return <AddGame />
    }else if (currentTab===ProfileConsts.ADD_PLAY_TAB) {
      return <AddPlay />
    }else{
      return <UnavailableSection/>
    }
  }

  getMenu(fixed){
    const {profile, avatarImage} = this.props
    const {currentTab} = profile
    const {activateFixedNavbar}: {activateFixedNavbar: boolean} = this.state

    return (
      <Menu
          className={classnames({
            [style.fixedNavbar]:fixed,
            [style.hidden]:(!fixed&&activateFixedNavbar),
            [style.invisible]:(fixed&&!activateFixedNavbar)})}
          icon="labeled"
          style={{backgroundColor:'white', marginTop:0}}
          tabular
          widths={5}
      >
        <OnlyLoggedinUser>
          <Menu.Item
              active={currentTab===ProfileConsts.ADD_GAME_TAB}
              onClick={()=>profile.changeTab(ProfileConsts.ADD_GAME_TAB)}
          >
              <Icon name="gamepad" />
              Game
            </Menu.Item>
        </OnlyLoggedinUser>
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
        <OnlyLoggedinUser>
          <Menu.Item
              active={currentTab===ProfileConsts.ADD_PLAY_TAB}
              onClick={()=>profile.changeTab(ProfileConsts.ADD_PLAY_TAB)}
          >
            <Icon name="share alternate" />
            Post
          </Menu.Item>
        </OnlyLoggedinUser>
      </Menu>
    )
  }

  render() {
    const {profile} = this.props
    const {currentTab} = profile

    return (
      <div className={classnames(style.profileSection)}>
        {this.getMenu(false)}
        {this.getMenu(true)}
        <Segment attached="bottom">
          {this.getCurrentTab(currentTab)}
        </Segment>
      </div>
    )
  }
}
