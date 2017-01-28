import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import {Icon} from 'react-fa'
import Statistics from '../Statistics'

import style from './style.css'

export default class ProfileNavbar extends Component {
  static propTypes = {
    avatar: PropTypes.string,
  }

  constructor(props){
    super(props)
    this.state = {
      avatarImage: undefined,
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

  render() {
    const {avatarImage} = this.state
    let avatarDivStyle = {}
    if (avatarImage){
      avatarDivStyle.backgroundImage = `url(${avatarImage})`
    }

    return (
      <div className={classnames(style.container)}>
        <div className={classnames(style.navBar)}>
          <div className={classnames(style.navItem)}>
            <Icon name="plus"/>
            <div>Game</div>
          </div>
          <div className={classnames(style.navItem)}>
            <Icon name="plus"/>
            <div>Lorem</div>
          </div>
          <div className={classnames(style.navItem, style.avatar)} style={avatarDivStyle} />
          <div className={classnames(style.navItem)}>
            <Icon name="plus"/>
            <div>Ipsum</div>
          </div>
          <div className={classnames(style.navItem)}>
            <Icon name="plus"/>
            <div>Play</div>
          </div>
        </div>

        <Statistics />
      </div>
    )
  }
}
