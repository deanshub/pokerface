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
import TopMenu from './TopMenu'

import 'semantic-ui-css/semantic.min.css'
import classnames from 'classnames'
import style from './style.css'
import image from '../../assets/landing logo.png'

@inject('auth')
@inject('routing')
@observer
export default class Navigation extends Component {
  static propTypes={
    children: PropTypes.element,
  }

  render() {
    return (
      <DocumentTitle title="Pokerface.io">
        <div>
          {
            process.env.NODE_ENV==='development'?<DevTools/>:null
          }
          <div className={classnames(style.header)}>
            <div className={classnames(style.title)}>
              <img className={classnames(style.titleImg)} src={image}/>
              <div>
                Pokerface.io
              </div>
            </div>
            <TopMenu/>
          </div>
          <div className={classnames(style.container)}>
            <div className={classnames(style.navbar)}>
              <Navbar />
            </div>
            <div className={classnames(style.content)}>
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
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
