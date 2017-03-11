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
    this.checkStaticNavbarActivation = this.checkStaticNavbarActivation.bind(this)
    this.state = {
      avatarImage: undefined,
      activateFixedNavbar: false,
    }
  }

  state: { avatarImage?: string, activateFixedNavbar: boolean }

  componentDidMount(){
    const {avatar} = this.props

    window.addEventListener('scroll', this.checkStaticNavbarActivation)

    import(`../../assets/images/${avatar}`).then(avatarImage=>{
      this.setState({
        avatarImage,
      })
    })
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.checkStaticNavbarActivation)
  }

  checkStaticNavbarActivation(){
    const {activateFixedNavbar} = this.state
    console.log(activateFixedNavbar, document.body.scrollTop);
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
    const {avatarImage, activateFixedNavbar}: {avatarImage?: string, activateFixedNavbar: boolean} = this.state
    const {currentTab} = profile

    return (
      <div>
        <Menu
            className={classnames({[style.fixedNavbar]:activateFixedNavbar})}
            icon="labeled"
            style={{backgroundColor:'white'}}
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
