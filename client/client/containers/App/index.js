// @flow

import React,{Component} from 'react'
import { syncHistoryWithStore } from 'mobx-react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import {Helmet} from 'react-helmet'
import logger from '../../utils/logger'
import RouterContent from './RouterContent'
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
        <React.Fragment>
          <Helmet>
            <meta charSet="utf-8" />
            <link href="https://pokerface.io" rel="canonical" />
            <meta content="Social platform for poker players" name="description" />
            <meta content={`https://pokerface.io${require('../../assets/logo.png')}`} property="og:image" />
            <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
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
          <RouterContent history={history}/>
        </React.Fragment>
      </Provider>
    )
  }
}
