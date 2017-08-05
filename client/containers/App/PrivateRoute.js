// @flow
import React,{Component} from 'react'
import { Route, Redirect } from 'react-router'
import { observer, inject } from 'mobx-react'

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
            return(
              auth.authenticating?null:
              auth.user.username ? (
                <Component {...props}/>
              ) : (
                <Redirect
                    to={{
                      pathname: routing.location.pathname==='/'?'/login':`/login?url=${routing.location.pathname}`,
                    }}
                />
              )
            )
          }}
      />
    )
  }
}
