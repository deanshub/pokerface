// @flow
import React,{Component} from 'react'
import { Route, Redirect } from 'react-router'
import { observer, inject } from 'mobx-react'

@inject('auth')
@observer
export default class PrivateRoute extends Component {
  componentWillMount(){
    this.props.auth.authenticate().then(()=>{
      this.forceUpdate()
    })
  }
  render(){
    const {component: Component, auth, ...rest} = this.props
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
                      pathname: '/login',
                    }}
                />
              )
            )
          }}
      />
    )
  }
}
