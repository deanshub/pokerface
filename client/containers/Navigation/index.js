// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import DevTools from 'mobx-react-devtools'
import { Route, Switch } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import Loadable from 'react-loadable'
import Loading from '../../components/basic/Loading'
import Navbar from '../../components/Navbar'
import Feed from '../Feed'
import RebrandedBlindsTimer from '../RebrandedBlindsTimer'
import TopMenu from './TopMenu'

const LoadableLearn = Loadable({
  loader: () => import('../../components/Learn'),
  loading: Loading,
})
const LoadableNoMatch = Loadable({
  loader: () => import('../../components/NoMatch'),
  loading: Loading,
})
const LoadableSpotNote = Loadable({
  loader: () => import('../../components/SpotNote'),
  loading: Loading,
})

const LoadableProfile = Loadable({
  loader: () => import('../../components/Profile'),
  loading: Loading,
})
const LoadableSingleEvent = Loadable({
  loader: () => import('../Event'),
  loading: Loading,
})
const LoadableEvents = Loadable({
  loader: () => import('../Events'),
  loading: Loading,
})

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
                  component={LoadableProfile}
                  exact
                  path="/profile/:username"
              />
              <Route
                  component={LoadableSingleEvent}
                  exact
                  path="/events/:eventId"
              />
              <Route
                  component={LoadableEvents}
                  exact
                  path="/events"
              />
              <Route
                  component={RebrandedBlindsTimer}
                  exact
                  path="/timer"
              />
              <Route
                  component={LoadableLearn}
                  exact
                  path="/smart"
              />
              <Route
                  component={LoadableSpotNote}
                  exact
                  path="/spotnote"
              />
              <Route component={LoadableNoMatch}/>
            </Switch>
          </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
