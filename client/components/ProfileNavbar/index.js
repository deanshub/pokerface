import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { Menu, Segment, Icon, Image } from 'semantic-ui-react'
import * as ProfileConsts from '../../constants/profile'
import Statistics from '../Statistics'
import AddGame from '../AddGame'
import UnavailableSection from '../UnavailableSection'
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
    }else if (currentTab===ProfileConsts.LEARN) {
      return <UnavailableSection/>
    }else{
      return <UnavailableSection/>
    }
  }

  changeTab(tab){
    this.setState({
      currentTab: tab,
    })
  }

  render() {
    const {avatarImage, currentTab} = this.state
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
              onClick={()=>::this.changeTab(ProfileConsts.ADD_GAME_TAB)}
          >
            <Icon name="gamepad" />
            Game
          </Menu.Item>
          <Menu.Item
              active={currentTab===ProfileConsts.LEARN}
              onClick={()=>::this.changeTab(ProfileConsts.LEARN)}
          >
            <Icon name="student" />
            Learn
          </Menu.Item>
          <Menu.Item
              active={currentTab===ProfileConsts.STATISTICS_TAB}
              onClick={()=>::this.changeTab(ProfileConsts.STATISTICS_TAB)}
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
              active={currentTab===ProfileConsts.ADD_GAME_IPSUM}
              onClick={()=>::this.changeTab(ProfileConsts.ADD_GAME_IPSUM)}
          >
            <Icon name="cube" />
            Ipsum
          </Menu.Item>
          <Menu.Item
              active={currentTab===ProfileConsts.ADD_PLAY_TAB}
              onClick={()=>::this.changeTab(ProfileConsts.ADD_PLAY_TAB)}
          >
            <Icon name="video play" />
            Play
          </Menu.Item>
        </Menu>
        <Segment attached="bottom">
          {this.getCurrentTab(currentTab)}
        </Segment>
      </div>
    )
  }
}
