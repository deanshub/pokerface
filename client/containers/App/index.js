// @flow

import React,{Component} from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { Router } from 'react-router-dom'
import { syncHistoryWithStore } from 'mobx-react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import {Helmet} from 'react-helmet'
import Loadable from 'react-loadable'
import Loading from '../../components/basic/Loading'
import logger from '../../utils/logger'
import 'semantic-ui-css/semantic.min.css'

import PrivateRoute from './PrivateRoute'

const LoadableLogin = Loadable({
  loader: () => import('../Login'),
  loading: Loading,
})
const LoadableSettingPassword = Loadable({
  loader: () => import('../SettingPassword'),
  loading: Loading,
})
const LoadableNavigation = Loadable({
  loader: () => import('../Navigation'),
  loading: Loading,
})
const LoadableStandalonePost = Loadable({
  loader: () => import('../Feed/StandalonePost'),
  loading: Loading,
})

import classnames from 'classnames'
import style from './style.css'

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
              <div className={classnames(style.app)}>
                <Route component={this.logPageView}/>
                <Route
                    path="/"
                    render={({location}) => {
                      return (location.hash==='#_=_')?<Redirect to={{...location, hash:undefined}}/>:null
                    }}
                />
                <Switch>
                  <Route
                      component={LoadableLogin}
                      exact
                      path="/login"
                  />
                  <Route
                      component={LoadableSettingPassword}
                      exact
                      path="/password/:uuid"
                  />
                  <Route
                      component={LoadableStandalonePost}
                      exact
                      path="/post/:id"
                  />
                  <PrivateRoute
                      component={LoadableNavigation}
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
