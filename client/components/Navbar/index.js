// @flow

import React, { Component, PropTypes } from 'react'
import { Menu, Button, Input, Icon, Label, Search, Image } from 'semantic-ui-react'
import request from 'superagent'
import { observer, inject } from 'mobx-react'
import PlayerSearchResult from './PlayerSearchResult'
import classnames from 'classnames'
import style from './style.css'

@inject('globalPlayersSearch')
@inject('routing')
@inject('auth')
@inject('events')
@observer
export default class Navbar extends Component {
  componentDidMount(){
    this.props.events.fetchMyGames()
  }

  handleMenuItemClick(location){
    this.props.routing.replace(location)
  }

  handleLogout(){
    const {routing} = this.props
    request.get('/logout').then(()=>{
      routing.replace('/login')
    }).catch(err=>{
      console.error(err)
      routing.replace('/login')
    })
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
    const {globalPlayersSearch, auth, events} = this.props

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
                  shape="circular"
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
            {/* <Menu.Item
                className={classnames(style.navbarMenuItemAnchor)}
                active={this.isActive('/smart', true)}
                onClick={()=>this.handleMenuItemClick('/smart')}
            >
              <Icon name="student"/> Get Smarter
            </Menu.Item> */}
            <Menu.Item
                active={this.isActive('/timer', true)}
                className={classnames(style.navbarMenuItemAnchor)}
                onClick={()=>this.handleMenuItemClick('/timer')}
            >
              <Icon name="clock"/> Blinds Timer
            </Menu.Item>
            <Menu.Item
                className={classnames(style.navbarMenuItemAnchor)}
                onClick={::this.handleLogout}
            >
              <Button>logout</Button>
            </Menu.Item>
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
        </Menu>
    )
  }
}
