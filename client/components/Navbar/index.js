// @flow

import React, { Component, PropTypes } from 'react'
import { Menu, Button, Input, Icon, Label, Search, Image } from 'semantic-ui-react'
import request from 'superagent'
import { observer, inject } from 'mobx-react'
import PlayerSearchResult from './PlayerSearchResult'

@inject('globalPlayersSearch')
@inject('routing')
@inject('auth')
@observer
export default class Navbar extends Component {
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
    routing.push(`/profile/${selected.username}`)
  }

  resultRenderer({username, fullName, avatar}){
    return (
      <PlayerSearchResult
          avatar={avatar}
          childKey={username}
          name={fullName}
          username={username}
      />
    )
  }

  isActive(path){
    const {routing} = this.props
    return routing.location.pathname===path
  }

  render() {
    const {globalPlayersSearch, auth} = this.props

    return (
        <Menu
            fixed="top"
            pointing
            secondary
            size="large"
            style={{marginBottom:0, backgroundColor:'white'}}
        >
          <Menu.Item
              active={this.isActive('/', true)}
              onClick={()=>this.handleMenuItemClick('/')}
          >
            <Icon name="home"/> Home
          </Menu.Item>
          <Menu.Item
              active={this.isActive('/profile', true)}
              onClick={()=>this.handleMenuItemClick('/profile')}
          >
            {auth.user.avatar?
              <Image
                  shape="circular"
                  size="mini"
                  src={auth.user.avatar.startsWith('http')?auth.user.avatar:`/images/${auth.user.avatar}`}
                  style={{marginTop:-5,marginBottom:-10, marginRight:10, maxHeight:35}}
              />
              :
              <Icon name="user"/>
            } Profile
          </Menu.Item>
          <Menu.Item
              active={this.isActive('/pulse', true)}
              onClick={()=>this.handleMenuItemClick('/pulse')}
          >
            <Icon name="heartbeat"/> Pulse
            <Label circular size="mini">1</Label>
          </Menu.Item>


          <Menu.Menu position="right">
            <Menu.Item
                active={this.isActive('/smart', true)}
                onClick={()=>this.handleMenuItemClick('/smart')}
            >
              <Icon name="student"/> Get Smarter
            </Menu.Item>
            <Menu.Item
                active={this.isActive('/timer', true)}
                onClick={()=>this.handleMenuItemClick('/timer')}
            >
              <Icon name="clock"/> Blinds Timer
            </Menu.Item>
            <Menu.Item onClick={::this.handleLogout}>
              <Button>logout</Button>
            </Menu.Item>
            <Menu.Item>
              <Search
                  as={Input}
                  icon={{ name: 'search', link: true }}
                  loading={globalPlayersSearch.loading}
                  noResultsMessage="No players found"
                  onResultSelect={::this.handleResultSelect}
                  onSearchChange={(e, value)=>globalPlayersSearch.search(value)}
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
