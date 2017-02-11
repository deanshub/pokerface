import React, { Component, PropTypes } from 'react'
// import { Link } from 'react-router'
import { Menu, Button, Input, Icon } from 'semantic-ui-react'
import { browserHistory } from 'react-router'
// import classnames from 'classnames'
// import style from './style.css'

export default class Navbar extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  handleMenuItemClick(location){
    browserHistory.replace(location)
  }

  render() {
    return (
        <Menu
            fixed="top"
            pointing
            secondary
            size="large"
            style={{marginBottom:0, backgroundColor:'white'}}
        >
          <Menu.Item
              active={this.context.router.isActive('/', true)}
              onClick={()=>this.handleMenuItemClick('/')}
          >
            <Icon name="home"/> Home
          </Menu.Item>
          <Menu.Item
              active={this.context.router.isActive('/profile', true)}
              onClick={()=>this.handleMenuItemClick('/profile')}
          >
            <Icon name="user"/> Profile
          </Menu.Item>
          <Menu.Item
              active={this.context.router.isActive('/pulse', true)}
              onClick={()=>this.handleMenuItemClick('/pulse')}
          >
            <Icon name="heartbeat"/> Pulse
          </Menu.Item>


          <Menu.Menu position="right">
            <Menu.Item>
              {/*dropdown Search Selection*/}
              <Input
                  icon={{ name: 'search', link: true }}
                  placeholder="Search Users..."
                  style={{marginBottom:2}}
                  transparent
              />
            </Menu.Item>
            <Menu.Item onClick={()=>this.handleMenuItemClick('/login')}>
              <Button>logout</Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
    )
  }
}
