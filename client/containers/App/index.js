import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { Provider } from 'mobx-react'
import React,{Component} from 'react'

import Login from '../Login'
import Navigation from '../Navigation'
import Feed from '../Feed'
import Profile from '../Profile'
import Pulse from '../Pulse'

import {AuthStore} from '../../store/AuthStore'
import {GameStore} from '../../store/GameStore'
import {PlayersStore} from '../../store/PlayersStore'
import {ProfileStore} from '../../store/ProfileStore'
import {TimerStore} from '../../store/TimerStore'

const routingStore = new RouterStore()
const stores = {
  routing: routingStore,
  auth: new AuthStore(),
  game: new GameStore(),
  players: new PlayersStore(),
  profile: new ProfileStore(),
  timer: new TimerStore(),
}
const history = syncHistoryWithStore(browserHistory, routingStore)

export default class App extends Component {
  render(){
    return(
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
    )
  }
}
