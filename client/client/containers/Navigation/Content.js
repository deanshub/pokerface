// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loader from '../../components/basic/Loader'
import Feed from '../Feed'
import RebrandedBlindsTimer from '../RebrandedBlindsTimer'

const LoadablePreFlop = Loadable({
  loader: () => import('../../components/PreFlop'),
  loading: Loader,
})
const LoadableNoMatch = Loadable({
  loader: () => import('../../components/NoMatch'),
  loading: Loader,
})
const LoadableSpotNote = Loadable({
  loader: () => import('../../components/SpotNote'),
  loading: Loader,
})
const LoadableProfile = Loadable({
  loader: () => import('../../components/Profile'),
  loading: Loader,
})
const LoadableSingleEvent = Loadable({
  loader: () => import('../Event'),
  loading: Loader,
})
const LoadableEvents = Loadable({
  loader: () => import('../Events'),
  loading: Loader,
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
              path="/tools/timer"
          />
          <Route
              component={LoadablePreFlop}
              exact
              path="/tools/pre-flop"
          />
          <Route
              component={LoadablePreFlop}
              exact
              path="/tools/shove-fold"
          />
          <Route
              component={LoadableSpotNote}
              exact
              path="/tools/spotnote"
          />
          <Route component={LoadableNoMatch}/>
        </Switch>
      </div>
    )
  }
}
