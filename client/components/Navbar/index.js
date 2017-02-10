import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
// import classnames from 'classnames'
import { Menu, Button } from 'semantic-ui-react'
// import style from './style.css'

export default class Navbar extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  render() {
    return (
        <Menu
            pointing
            secondary
            size="large"
        >
          <Link to="/">
            <Menu.Item active={this.context.router.isActive('/', true)} name="home"/>
          </Link>
          <Link to="/profile">
            <Menu.Item active={this.context.router.isActive('/profile', true)} name="profile"/>
          </Link>

            <Menu.Menu position="right">
              <Link to="/login">
                <Menu.Item>
                  <Button>logout</Button>
                </Menu.Item>
              </Link>
            </Menu.Menu>
        </Menu>
    )
  }
}
