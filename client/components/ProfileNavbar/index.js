// @flow

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { Menu, Segment, Image } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

import * as ProfileConsts from '../../constants/profile'
import Statistics from '../Statistics'
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
    }else{
      return <UnavailableSection/>
    }
  }

  getMenu(fixed: boolean){
    const {profile, avatarImage} = this.props
    const {activateFixedNavbar}: {activateFixedNavbar: boolean} = this.state


    console.log(profile.get('fullname'))

    return (
      <div
          className={classnames({
            [style.fixedNavbar]:fixed,
            [style.hidden]:(!fixed&&activateFixedNavbar),
            [style.invisible]:(fixed&&!activateFixedNavbar)})}
          style={{backgroundColor:'white', marginTop:0}}
      >
        <div style={{maxHeight:74, textAlign: 'center'}}>
          { profile.currentUser.fullname }
          <Image
              avatar
              className={classnames(style.avatar)}
              size="tiny"
              src={avatarImage}
          />
        </div>
      </div>
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
