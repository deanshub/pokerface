import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { Provider } from 'mobx-react'
import ReactDOM from 'react-dom'
import React from 'react'
import DocumentTitle from 'react-document-title'

import Login from './containers/Login'
import Navigation from './containers/Navigation'
import Feed from './containers/Feed'
import Profile from './containers/Profile'
import Pulse from './containers/Pulse'

import {AuthStore} from './store/AuthStore'
import {GameStore} from './store/GameStore'

const routingStore = new RouterStore()
const stores = {
  routing: routingStore,
  auth: new AuthStore(),
  games: new GameStore(),
}
const history = syncHistoryWithStore(browserHistory, routingStore)

ReactDOM.render(
  <DocumentTitle title="Pokerface.io">
    <Provider {...stores}>
      <Router history={history}>
        <Route component={Login} path="/login"/>

        <Route component={Navigation} path="/">
          <IndexRoute component={Feed}/>

          <Route component={Profile} path="/profile/:userId"/>
          <Route component={Profile} path="/profile"/>
          <Route component={Pulse} path="/pulse"/>
        </Route>
      </Router>
    </Provider>
  </DocumentTitle>
  ,
  document.getElementById('root')
)
