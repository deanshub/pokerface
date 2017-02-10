import React, { Component, PropTypes } from 'react'
// import { Link } from 'react-router'
import { Menu, Button, Input } from 'semantic-ui-react'
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
            pointing
            secondary
            size="large"
            style={{marginBottom:0}}
        >
          <Menu.Item
              active={this.context.router.isActive('/', true)}
              name="home"
              onClick={()=>this.handleMenuItemClick('/')}
          />
          <Menu.Item
              active={this.context.router.isActive('/profile', true)}
              name="profile"
              onClick={()=>this.handleMenuItemClick('/profile')}
          />
          <Menu.Item
              active={this.context.router.isActive('/pulse', true)}
              name="pulse"
              onClick={()=>this.handleMenuItemClick('/pulse')}
          />


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
