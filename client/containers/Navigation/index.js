// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import DevTools from 'mobx-react-devtools'
import { Route, Switch } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import Navbar from '../../components/Navbar'
import Feed from '../Feed'
import Profile from '../../components/Profile'
import Events from '../Events'
import RebrandedBlindsTimer from '../RebrandedBlindsTimer'
import Learn from '../../components/Learn'
import NoMatch from '../../components/NoMatch'
import SelectUserModal from '../../containers/SelectUserModal'

import 'semantic-ui-css/semantic.min.css'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('routing')
@observer
export default class Navigation extends Component {
  static propTypes={
    children: PropTypes.element,
  }

  state = {showTopMenu:false, selectUserModalOpen:false}

  handleLogout(){
    const {routing, auth} = this.props
    localStorage.removeItem('jwt')
    auth.logout()
    routing.replace('/login')
  }

  render() {

    const {user} = this.props.auth
    const {showTopMenu, selectUserModalOpen} = this.state

    const topMenu = <div className={classnames(style.topMenu)}>
      <div className={classnames(style.signedInAsCard)}>
        <img src={user.avatar}/>
        <div>
          <div className={classnames(style.signedInAs)}>Signed is as</div>
          <div>{user.fullname}</div>
        </div>
      </div>
      <div
          className={classnames(style.topMenuItem)}
          onClick={() => this.setState({selectUserModalOpen:true})}
      >
        Switch user
      </div>
      <div className={classnames(style.topMenuItem)} onClick={::this.handleLogout}>Logout</div>
    </div>

    return (
      <DocumentTitle title="Pokerface.io">
        <div>
          {/* {
            process.env.NODE_ENV==='development'?<DevTools/>:null
          } */}
          <div className={classnames(style.header)}>
            <div className={classnames(style.title)}>
              POKERFACE
            </div>
            <div
                className={classnames(style.config)}
                onBlur={() => {this.setState({showTopMenu:false})}}
                onClick={() => {this.setState({showTopMenu:true})}}
            >
              {showTopMenu && topMenu}
            </div>
          </div>
          <div className={classnames(style.container)}>
            <Navbar />
            <div>
              <Switch>
                <Route
                    component={Feed}
                    exact
                    path="/"
                />

              <Route
                  component={Profile}
                  exact
                  path="/profile/:username"
              />
              <Route
                  component={Profile}
                  exact
                  path="/profile"
              />
              <Route
                  component={Events}
                  exact
                  path="/events"
              />
              <Route
                  component={RebrandedBlindsTimer}
                  exact
                  path="/timer"
              />
              <Route
                  component={Learn}
                  exact
                  path="/smart"
              />
              <Route component={NoMatch}/>
            </Switch>
          </div>
          {
            selectUserModalOpen &&
            <SelectUserModal
                onClose={() => this.setState({selectUserModalOpen:false})}
                open={selectUserModalOpen}
                redirectUrl="/"
            />
          }
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
