// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '../../components/basic/Loading'
import Feed from '../Feed'
import RebrandedBlindsTimer from '../RebrandedBlindsTimer'

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

export default class Navigation extends Component {
  static propTypes={
    children: PropTypes.element,
  }

  render() {
    return (
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
    )
  }
}
