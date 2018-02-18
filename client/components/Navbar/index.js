// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import { NavLink } from 'react-router-dom'
import Notification from './Notification'
import SearchBar from '../../containers/SearchBar'

@inject('auth')
@inject('events')
@inject('profile')
@observer
export default class Navbar extends Component {

  componentWillMount(){
    this.props.auth.fetchOptionalUsersSwitch()
  }

  componentDidMount(){
    this.props.events.fetchMyGames()
    this.props.events.startSubscription()
    //this.props.profile
  }

  // TODO: Consult with Dean
  shouldComponentUpdate(){
    return true
  }

  render() {
    const {auth, events} = this.props
    const {username} = auth.user

    return (
      <div className={classnames(style.container)}>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              exact
              to="/"
          >
            Home
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              to={`/profile/${username}`}
          >
            Profile
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              to="/events"
          >
            Events <Notification number={events.events.size}/>
          </NavLink>
          <div className={classnames(style.navbarSection)}>
            Tools
          </div>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              to="/tools/pre-flop"
          >
            Pre-Flop Chart
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              to="/tools/shove-fold"
          >
            Shove\ Fold Chart
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              to="/tools/timer"
          >
            Blind Timer
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              to="/tools/spotnote"
          >
            Spot Note
          </NavLink>
          <div className={classnames(style.navbarSection)}>
            Search
          </div>
          <SearchBar/>
        </div>
    )
  }
}
