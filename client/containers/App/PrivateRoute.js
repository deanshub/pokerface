// @flow
import React,{Component} from 'react'
import { Route, Redirect } from 'react-router'
import { observer, inject } from 'mobx-react'
import Loadable from 'react-loadable'
import Loading from '../../components/basic/Loading'

const LoadableSingleEvent = Loadable({
  loader: () => import('../Event'),
  loading: Loading,
})

@inject('auth')
@inject('routing')
@observer
export default class PrivateRoute extends Component {
  componentWillMount(){
    this.props.auth.authenticate().then(()=>{
      this.forceUpdate()
    })
  }

  render(){
    const {component: Component, auth, routing, ...rest} = this.props
    return (
      <Route
          {...rest}
          render={(props) => {
            if (auth.authenticating) {
              return (
                <Loading/>
              )
            }else if (auth.user.username){
              return (
                <Component {...props}/>
              )
            }else if (/\/events\/.+/.test(routing.location.pathname)){
              return (
                <Route
                    component={LoadableSingleEvent}
                    exact
                    path="/events/:eventId"
                />
              )
            }else{
              return (
                <Redirect
                    to={routing.location.pathname==='/'?'/login':`/login?url=${routing.location.pathname}`}
                />
              )
            }
          }}
      />
    )
  }
}
