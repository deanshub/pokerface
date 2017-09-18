// @flow
import React, { Component, PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import DevTools from 'mobx-react-devtools'
import { Route, Switch } from 'react-router-dom'

import Navbar from '../../components/Navbar'
import Feed from '../Feed'
import Profile from '../../components/Profile'
import Events from '../Events'
import BlindsTimer from '../../components/BlindsTimer'
import Lern from '../../components/Lern'

import 'semantic-ui-css/semantic.min.css'
import classnames from 'classnames'
import style from './style.css'

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
          <Navbar />
          <div className={classnames(style.container)} style={{paddingTop: 50}}>
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
                  component={BlindsTimer}
                  exact
                  path="/timer"
              />
              <Route
                  component={Lern}
                  exact
                  path="/smart"
              />
            </Switch>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
