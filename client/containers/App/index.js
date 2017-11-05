// @flow

import { Route, Switch } from 'react-router'
import { Router } from 'react-router-dom'
import { syncHistoryWithStore } from 'mobx-react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import React,{Component} from 'react'
import {Helmet} from 'react-helmet'
import logger from '../../utils/logger'

import Login from '../Login'
import Navigation from '../Navigation'
import PrivateRoute from './PrivateRoute'
import StandalonePost from '../Feed/StandalonePost'



const browserHistory = createBrowserHistory()
import stores from './stores'
const history = syncHistoryWithStore(browserHistory, stores.routing)

export default class App extends Component {
  logPageView(){
    logger.logPageView(window.location.pathname + window.location.search)
    return null
  }
  render(){
    return(
        <Provider {...stores}>
          <div>
            <Helmet>
              <meta charSet="utf-8" />
              <link href="http://pokerface.io" rel="canonical" />
              <meta content="Social platform for poker players" name="description" />
              <meta content={`http://pokerface.io${require('../../assets/logo.png')}`} property="og:image" />
              <link href={require('../../assets/logo.png')} rel="image_src"/>
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
              <div>
                <Route component={this.logPageView}/>
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
              </div>
            </Router>
          </div>
      </Provider>
    )
  }
}
