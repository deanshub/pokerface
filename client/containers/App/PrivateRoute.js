// @flow
import React,{Component} from 'react'
import { Route, Redirect } from 'react-router'
import { observer, inject } from 'mobx-react'
import Loadable from 'react-loadable'
import Loader from '../../components/basic/Loader'

const LoadableSingleEvent = Loadable({
  loader: () => import('../Event'),
  loading: Loader,
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
                <Loader/>
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
