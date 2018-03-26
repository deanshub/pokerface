import React,{Component} from 'react'
import { Router } from 'react-router-dom'
import { Route, Switch, Redirect } from 'react-router'
import { observer, inject } from 'mobx-react'
import Loadable from 'react-loadable'
import Loader from '../../components/basic/Loader'
import PrivateRoute from './PrivateRoute'
import classnames from 'classnames'
import style from './style.css'

const LoadableLogin = Loadable({
  loader: () => import('../Login'),
  loading: Loader,
})
const LoadableSettingPassword = Loadable({
  loader: () => import('../SettingPassword'),
  loading: Loader,
})
const LoadableNavigation = Loadable({
  loader: () => import('../Navigation'),
  loading: Loader,
})
const LoadableStandalonePost = Loadable({
  loader: () => import('../Feed/StandalonePost'),
  loading: Loader,
})

@inject('auth')
@observer
export default class RouterContent extends Component {

  render(){
    const {auth, history} = this.props
    const {theme} = auth

    return (
      <Router history={history}>
        <div className={classnames(style.app, style[theme])}>
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
                theme={theme}
            />
          </Switch>
        </div>
      </Router>
    )
  }
}
