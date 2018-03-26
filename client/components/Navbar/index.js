// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import { NavLink } from 'react-router-dom'
import Notification from '../Notification'
import SearchBar from '../../containers/SearchBar'

@inject('auth')
@inject('events')
@inject('feed')
@observer
export default class Navbar extends Component {

  componentWillMount(){
    this.props.auth.fetchOptionalUsersSwitch()
  }

  componentDidMount(){
    const {auth, events, feed} = this.props
    events.fetchMyGames()
    events.startSubscription()
    feed.fetchNewRelatedPosts().then(() => {
      feed.startSubscription(auth.user.username)
    })
  }

  // TODO: Consult with Dean
  shouldComponentUpdate(){
    return true
  }

  onHomeClick(){
    this.props.feed.pushNewReceivedPost()
  }

  onProfileClick(){
    this.props.feed.pushNewReceivedPost(true)
  }

  render() {
    const {auth, events, feed} = this.props
    const {user:{username}, theme} = auth
    const { newPostsCount, newRelatedPostsCount } = feed

    return (
      <div className={classnames(style.container, style[theme])}>
        <NavLink
            activeClassName={classnames(style.navbarRouteItemActive)}
            className={classnames(style.navbarRouteItem)}
            exact
            onClick={::this.onHomeClick}
            to="/"
        >
          Home
          <Notification className={style.notification} number={newPostsCount}/>
        </NavLink>
        <NavLink
            activeClassName={classnames(style.navbarRouteItemActive)}
            className={classnames(style.navbarRouteItem)}
            onClick={::this.onProfileClick}
            to={`/profile/${username}`}
        >
          Profile
          <Notification className={style.notification} number={newRelatedPostsCount}/>
        </NavLink>
        <NavLink
            activeClassName={classnames(style.navbarRouteItemActive)}
            className={classnames(style.navbarRouteItem)}
            to="/events"
        >
          Events <Notification className={style.notification} number={events.events.size}/>
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
        <SearchBar theme={theme}/>
      </div>
    )
  }
}
