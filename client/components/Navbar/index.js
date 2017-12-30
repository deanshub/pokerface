// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Menu, Input, Icon, Label, Search, Image, Dropdown } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import PlayerSearchResult from './PlayerSearchResult'
import classnames from 'classnames'
import style from './style.css'
import { NavLink } from 'react-router-dom'

@inject('globalPlayersSearch')
@inject('routing')
@inject('auth')
@inject('events')
@inject('feed')
@inject('timer')
@observer
export default class Navbar extends Component {
  constructor(props){
    super(props)
    this.state = {selectUserModalOpen: false}
  }

  componentWillMount(){
    this.props.auth.fetchOptionalUsersSwitch()
  }

  componentDidMount(){
    this.props.events.fetchMyGames()
  }

  handleMenuItemClick(location){
    this.props.routing.replace(location)
  }

  handleLogout(){
    const {routing, auth} = this.props
    localStorage.removeItem('jwt')
    auth.logout()
    routing.replace('/login')
  }

  handleResultSelect(e, selected){
    const {routing, globalPlayersSearch} = this.props
    globalPlayersSearch.searchValue = ''
    routing.push(`/profile/${selected.result.username}`)
  }

  resultRenderer({username, fullname, avatar}){
    return (
      <PlayerSearchResult
          avatar={avatar}
          childKey={username}
          name={fullname}
          username={username}
      />
    )
  }

  isActive(path){
    const {routing} = this.props
    return routing.location.pathname===path
  }

  render() {
    const {globalPlayersSearch, auth, events, routing} = this.props
    const {selectUserModalOpen} = this.state
    const showSwitchUser = auth.optionalUsers.length > 0

    return (
      <div className={classnames(style.navbar)}>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              exact
              to="/"
          >
            HOME
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              exact
              to="/profile"
          >
            PROFILE
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              exact
              to="/events"
          >
            EVENTS
            {
              events.games.size>0?
              <Label circular size="mini">{events.games.size}</Label>:
              undefined
            }
          </NavLink>
          <div className={classnames(style.navbarSection)}>
            TOOLS
          </div>
            <NavLink
                activeClassName={classnames(style.navbarRouteItemActive)}
                className={classnames(style.navbarRouteItem)}
                exact
                to="/smart"
            >
              PER-FLOP CHART
            </NavLink>
            <NavLink
                activeClassName={classnames(style.navbarRouteItemActive)}
                className={classnames(style.navbarRouteItem)}
                exact
                to="/timer"
            >
              BLINDS TIMER
            </NavLink>
            <div>
              <Search
                  as={Input}
                  icon={{ name: 'search', link: true }}
                  loading={globalPlayersSearch.loading}
                  noResultsMessage="No players found"
                  onResultSelect={::this.handleResultSelect}
                  onSearchChange={(e, {value})=>globalPlayersSearch.search(value)}
                  placeholder="Search Users..."
                  resultRenderer={::this.resultRenderer}
                  results={globalPlayersSearch.availablePlayers}
                  style={{marginBottom:2}}
                  transparent
                  value={globalPlayersSearch.searchValue}
              />
            </div>
          </div>
    )
  }
}
