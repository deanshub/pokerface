// @flow

import { Router, Route, Switch } from 'react-router'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import React,{Component} from 'react'

import Login from '../Login'
import Navigation from '../Navigation'
import PrivateRoute from './PrivateRoute'

import {AuthStore} from '../../store/AuthStore'
import {GameStore} from '../../store/GameStore'
import {PlayersStore} from '../../store/PlayersStore'
import {ProfileStore} from '../../store/ProfileStore'
import {TimerStore} from '../../store/TimerStore'
import {FeedStore} from '../../store/FeedStore'
import {PhotoGalleryStore} from '../../store/PhotoGalleryStore'
import {PlayersSearchStore} from '../../store/PlayersSearchStore'
import {EventStore} from '../../store/EventStore'

const browserHistory = createBrowserHistory()
const routingStore = new RouterStore()
const stores = {
  routing: routingStore,
  auth: new AuthStore(),
  game: new GameStore(),
  players: new PlayersStore(),
  profile: new ProfileStore(),
  timer: new TimerStore(),
  feed: new FeedStore(),
  photoGallery: new PhotoGalleryStore(),
  globalPlayersSearch: new PlayersSearchStore(),
  events: new EventStore(),
}
const history = syncHistoryWithStore(browserHistory, routingStore)

export default class App extends Component {
  render(){
    return(
      <Provider {...stores}>
        <Router history={history}>
          <Switch>
            <Route
                component={Login}
                exact
                path="/login"
            />

            <PrivateRoute
                component={Navigation}
                path="/"
            />
        </Switch>
      </Router>
    </Provider>
    )
  }
}
