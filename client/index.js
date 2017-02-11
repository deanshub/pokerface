import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'
import DocumentTitle from 'react-document-title'

import Login from './containers/Login'
import Navigation from './containers/Navigation'
import Feed from './containers/Feed'
import Profile from './containers/Profile'
import Pulse from './containers/Pulse'

import configure from './store'

const store = configure()
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <DocumentTitle title="Pokerface.io">
    <Provider store={store}>
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
