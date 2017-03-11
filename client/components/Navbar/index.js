// @flow

import React, { Component, PropTypes } from 'react'
// import { Link } from 'react-router'
import { Menu, Button, Input, Icon, Label, Search } from 'semantic-ui-react'
import { browserHistory } from 'react-router'
import request from 'superagent'
import { observer, inject } from 'mobx-react'
// import classnames from 'classnames'
// import style from './style.css'
import PlayerSearchResult from './PlayerSearchResult'

@inject('globalPlayersSearch')
@inject('routing')
@observer
export default class Navbar extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  handleMenuItemClick(location){
    browserHistory.replace(location)
  }

  handleLogout(){
    request.get('/logout').then(()=>{
      browserHistory.replace('/login')
    }).catch(err=>{
      console.error(err)
      browserHistory.replace('/login')
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
    const {globalPlayersSearch} = this.props

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
            <Icon name="user"/> Profile
          </Menu.Item>
          <Menu.Item
              active={this.isActive('/pulse', true)}
              onClick={()=>this.handleMenuItemClick('/pulse')}
          >
            <Icon name="heartbeat"/> Pulse
            <Label circular size="mini">1</Label>
          </Menu.Item>


          <Menu.Menu position="right">
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
            <Menu.Item onClick={this.handleLogout}>
              <Button>logout</Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
    )
  }
}
