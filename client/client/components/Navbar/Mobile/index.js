// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { NavLink } from 'react-router-dom'
import Notification from '../../Notification'
import EditProfileModal from '../../../containers/EditProfile'
import SelectTheme from '../../../containers/SelectTheme'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('routing')
@inject('events')
@inject('feed')
@observer
export default class Navigation extends Component {
  constructor(props){
    super(props)

    this.state = {editingPersonalInfo:false}
  }

  componentDidMount(){
    const {auth, events, feed} = this.props
    events.fetchMyGames()
    events.startSubscription()
    feed.fetchNewRelatedPosts().then(() => {
      feed.startSubscription(auth.user.username)
    })
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

  onHomeClick(){
    const {feed} = this.props
    feed.pushNewReceivedPost()
    this.props.onClose()
  }

  onProfileClick(){
    const {feed} = this.props
    feed.pushNewReceivedPost(true)
  }

  toggleEditPersonalInfo(){
    this.setState({
      editingPersonalInfo: !this.state.editingPersonalInfo,
    })
  }

  render() {
    const {auth, events, feed, open} = this.props
    const {editingPersonalInfo} = this.state
    const {username} = auth.user
    const { newPostsCount, newRelatedPostsCount } = feed

    return (
      <div className={classnames(style.container, style[auth.theme], {[style.closed]:!open})}>
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
              onClick={::this.onHomeClick}
              to="/"
          >
            <div className={classnames(style.home)}>
              <Notification className={style.notification} number={newPostsCount}/>
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
              <Notification className={style.notification} number={events.events.size}/>
            </div>
            Events
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              onClick={::this.onProfileClick}
              to={`/profile/${username}`}
          >
            <div className={classnames(style.profile)}>
              <Notification className={style.notification} number={newRelatedPostsCount}/>
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
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              onClick={::this.onClose}
              to="/tools/cash-calc"
          >
            <div className={classnames(style.cashCalculator)}/>
            Cash Calculator
          </NavLink>
        </div>
        <div className={classnames(style.divider)}/>
        <div className={classnames(style.footer)}>
          <div className={classnames(style.footerItem)} onClick={::this.handleLogout}>
              Logout
          </div>
          <div className={classnames(style.footerItem)} onClick={::this.toggleEditPersonalInfo}>
              Edit Details
          </div>
          <SelectTheme className={style.footerItem}/>
        </div>
        <EditProfileModal
            open={editingPersonalInfo}
            toggle={::this.toggleEditPersonalInfo}
        />
      </div>
    )
  }
}
