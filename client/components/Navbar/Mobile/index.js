// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { NavLink } from 'react-router-dom'
import Notification from '../../Notification'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('routing')
@inject('events')
@inject('feed')
@observer
export default class Navigation extends Component {

  componentDidMount(){
    this.props.events.fetchMyGames()
  }

  handleLogout(){
    const {routing, auth} = this.props
    localStorage.removeItem('jwt')
    auth.logout()
    routing.replace('/login')
  }

  onClose(){
    this.props.onClose()
  }

  onRouteItemCLick(){
    const {feed, onClose} = this.props
    feed.clearNewReceivedPost()
    onClose()
  }

  render() {
    const {auth, events, feed, open} = this.props
    const {username} = auth.user
    const { newReceivedPostsCount } = feed

    return (
      <div className={classnames(style.container, {[style.closed]:!open})}>
        <div className={classnames(style.header)}>
          <div className={classnames(style.back)} onClick={::this.onClose}/>
          <div className={classnames(style.title)}>
            Pokerface
          </div>
        </div>
        <div className={classnames(style.navbar)}>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              exact
              onClick={::this.onRouteItemCLick}
              to="/"
          >
            <div className={classnames(style.home)}>
              <Notification className={style.notification} number={newReceivedPostsCount}/>
            </div>
            Home
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              onClick={::this.onClose}
              to="/events"
          >
            <div className={classnames(style.events)}>
              <Notification number={events.events.size}/>
            </div>
            Events
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              onClick={::this.onRouteItemCLick}
              to={`/profile/${username}`}
          >
            <div className={classnames(style.profile)}>
              <Notification className={style.notification} number={newReceivedPostsCount}/>
            </div>
            Profile
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              onClick={::this.onClose}
              to="/tools/pre-flop"
          >
            <div className={classnames(style.chart)}/>
            Pre-Flop Chart
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              onClick={::this.onClose}
              to="/tools/shove-fold"
          >
            <div className={classnames(style.chart)}/>
            Shove\ Fold Chart
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              onClick={::this.onClose}
              to="/tools/timer"
          >
            <div className={classnames(style.blindsTimer)}/>
            Blind Timer
          </NavLink>
        </div>
        <div className={classnames(style.divider)}/>
        <div className={classnames(style.footer)}>
          <div className={classnames(style.footerItem)} onClick={::this.handleLogout}>
              Logout
          </div>
        </div>
      </div>
    )
  }
}
