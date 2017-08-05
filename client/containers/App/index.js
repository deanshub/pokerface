// @flow

import { Router, Route, Switch } from 'react-router'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import React,{Component} from 'react'
import {Helmet} from 'react-helmet'

import Login from '../Login'
import Navigation from '../Navigation'
import PrivateRoute from './PrivateRoute'
import StandalonePost from '../Feed/StandalonePost'

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
          <div>
            <Helmet>
              <meta charSet="utf-8" />
              <link href="http://pokerface.io" rel="canonical" />
              <meta content="Social platform for poker players" name="description" />
              <link
                  href={require('../../assets/favicon-32x32.png')}
                  rel="icon"
                  sizes="32x32"
                  type="image/png"
              />
              <link
                  href={require('../../assets/favicon-16x16.png')}
                  rel="icon"
                  sizes="16x16"
                  type="image/png"
              />
            </Helmet>

            <Router history={history}>
              <Switch>
                <Route
                    component={Login}
                    exact
                    path="/login"
                />

                <Route
                    component={StandalonePost}
                    exact
                    path="/post/:id"
                />

                <PrivateRoute
                    component={Navigation}
                    path="/"
                />
              </Switch>
            </Router>
          </div>
      </Provider>
    )
  }
}
