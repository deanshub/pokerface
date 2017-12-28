// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Menu, Input, Icon, Label, Search, Image, Dropdown } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import PlayerSearchResult from './PlayerSearchResult'
import classnames from 'classnames'
import style from './style.css'
import SelectUserModal from '../../containers/SelectUserModal'

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
        <Menu
            fixed="top"
            pointing
            secondary
            size="large"
            style={{marginBottom:0, backgroundColor:'white'}}
        >
          <Menu.Item
              className={classnames(style.navbarMenuItemAnchor)}
              active={this.isActive('/', true)}
              onClick={()=>this.handleMenuItemClick('/')}
          >
            <Icon name="home"/> Home
          </Menu.Item>
          <Menu.Item
              className={classnames(style.navbarMenuItemAnchor)}
              active={this.isActive('/profile', true)}
              onClick={()=>this.handleMenuItemClick('/profile')}
          >
            {auth.user.avatar?
              <Image
                  avatar
                  size="mini"
                  src={auth.user.avatar}
                  style={{marginTop:-5,marginBottom:-10, marginRight:10, maxHeight:35}}
              />
              :
              <Icon name="user"/>
            } Profile
          </Menu.Item>
          <Menu.Item
              active={this.isActive('/events', true)}
              className={classnames(style.navbarMenuItemAnchor)}
              onClick={()=>this.handleMenuItemClick('/events')}
          >
            <Icon name="calendar"/> Events
            {
              events.games.size>0?
              <Label circular size="mini">{events.games.size}</Label>:
              undefined
            }
          </Menu.Item>


          <Menu.Menu position="right">
            <Menu.Item
                active={this.isActive('/smart', true)}
                className={classnames(style.navbarMenuItemAnchor)}
                onClick={()=>this.handleMenuItemClick('/smart')}
            >
              <Icon name="student"/> Get Smarter
            </Menu.Item>
            <Menu.Item
                active={this.isActive('/timer', true)}
                className={classnames(style.navbarMenuItemAnchor)}
                onClick={()=>this.handleMenuItemClick('/timer')}
            >
              <Icon name="clock"/> Blinds Timer
            </Menu.Item>
            <Dropdown
                className="link item"
                icon={<Icon name="user" size="large"/>}
            >
              <Dropdown.Menu style={{minWidth:'max-content'}}>
                {
                  showSwitchUser &&
                  <Dropdown.Item onClick={() => this.setState({selectUserModalOpen:true})}>
                      switch user
                  </Dropdown.Item>
                }
                <Dropdown.Item
                    className={classnames(style.navbarMenuItemAnchor)}
                    onClick={::this.handleLogout}
                >
                  logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item>
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
            </Menu.Item>
          </Menu.Menu>
          {
            selectUserModalOpen &&
            <SelectUserModal
                onClose={() => this.setState({selectUserModalOpen:false})}
                open={selectUserModalOpen}
                redirectUrl="/"
            />
          }
        </Menu>
    )
  }
}
