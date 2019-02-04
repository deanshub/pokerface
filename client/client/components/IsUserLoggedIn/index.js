// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

@inject('auth')
@observer
export default class IsUserLoggedIn extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    opposite: PropTypes.bool,
  }

  componentWillMount(){
    this.props.auth.authenticate().then(()=>{
      this.forceUpdate()
    })
  }

  static defaultProps = {
    opposite: false,
  }

  render() {
    const { auth, children, opposite } = this.props

    const isLoggedinUser = auth.user.username!==undefined
    const withOpposite = opposite?!isLoggedinUser:isLoggedinUser
    return withOpposite?React.Children.only(children):null
  }
}
