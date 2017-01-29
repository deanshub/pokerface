import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import {Icon} from 'react-fa'
import Statistics from '../Statistics'
import * as ProfileConsts from '../../constants/profile'
import AddGame from '../AddGame'

import style from './style.css'

export default class ProfileNavbar extends Component {
  static propTypes = {
    avatar: PropTypes.string,
  }

  constructor(props){
    super(props)
    this.state = {
      avatarImage: undefined,
      currentTab: ProfileConsts.STATISTICS_TAB,
    }
  }

  componentDidMount(){
    const {avatar} = this.props

    System.import(`../../assets/images/${avatar}`).then(avatarImage=>{
      this.setState({
        avatarImage,
      })
    })
  }

  getCurrentTab(currentTab){
    if (currentTab===ProfileConsts.STATISTICS_TAB){
      return <Statistics />
    }else if (currentTab===ProfileConsts.ADD_GAME_TAB) {
      return <AddGame />
    }else if (currentTab===ProfileConsts.ADD_PLAY_TAB) {
      return null
    }
  }

  changeTab(tab){
    this.setState({
      currentTab: tab,
    })
  }

  render() {
    const {avatarImage, currentTab} = this.state
    let avatarDivStyle = {}
    if (avatarImage){
      avatarDivStyle.backgroundImage = `url(${avatarImage})`
    }

    return (
      <div className={classnames(style.container)}>
        <div className={classnames(style.navBar)}>
          <div
              className={classnames(style.navItem, {[style.navItemActive]:currentTab===ProfileConsts.ADD_GAME_TAB})}
              onClick={()=>::this.changeTab(ProfileConsts.ADD_GAME_TAB)}
          >
            <Icon name="plus"/>
            <div>Game</div>
          </div>
          <div className={classnames(style.navItem)}>
            <Icon name="plus"/>
            <div>Lorem</div>
          </div>
          <div
              className={classnames(style.navItem, style.avatar, {[style.navItemActive]:currentTab===ProfileConsts.STATISTICS_TAB})}
              onClick={()=>::this.changeTab(ProfileConsts.STATISTICS_TAB)}
              style={avatarDivStyle}
          />
          <div className={classnames(style.navItem)}>
            <Icon name="plus"/>
            <div>Ipsum</div>
          </div>
          <div
              className={classnames(style.navItem, {[style.navItemActive]:currentTab===ProfileConsts.ADD_PLAY_TAB})}
              onClick={()=>::this.changeTab(ProfileConsts.ADD_PLAY_TAB)}
          >
            <Icon name="plus"/>
            <div>Play</div>
          </div>
        </div>

        {this.getCurrentTab(currentTab)}
      </div>
    )
  }
}
