// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { NavLink } from 'react-router-dom'
import Notification from '../Notification'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('routing')
@observer
export default class Navigation extends Component {

  onClose(){
    this.props.onClose()
  }

  render() {
    const {auth, events, open} = this.props
    const {username} = auth.user

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
              onClick={::this.onClose}
              to="/"
          >
            <div className={classnames(style.home)}/>
            Home
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              onClick={::this.onClose}
              to="/events"
          >
            <div className={classnames(style.events)}>
              <Notification number={45}/>
            </div>
            Events
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              onClick={::this.onClose}
              to={`/profile/${username}`}
          >
            <div className={classnames(style.profile)}/>
            Profile
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              onClick={::this.onClose}
              to="/smart"
          >
            <div className={classnames(style.chart)}/>
            Pre-Flop Chart
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              onClick={::this.onClose}
              to="/timer"
          >
            <div className={classnames(style.blindsTimer)}/>
            Blind Timer
          </NavLink>
        </div>
        <div className={classnames(style.divider)}/>
        <div className={classnames(style.footer)}>
          <div className={classnames(style.footerItem)}>
            <div className={classnames(style.logout)}>
              Logout
            </div>
          </div>
        </div>
      </div>
    )
  }
}
