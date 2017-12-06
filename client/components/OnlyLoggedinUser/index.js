// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

@inject('auth')
@inject('profile')
@observer
export default class OnlyLoggedinUser extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    opposite: PropTypes.bool,
  }

  static defaultProps = {
    opposite: false,
  }

  render() {
    const { profile, auth, children, opposite } = this.props
    const user = profile.currentUser

    const isLoggedinUser = user.get('username')===auth.user.username
    const withOpposite = isLoggedinUser&&!opposite
    return withOpposite?React.Children.only(children):null
  }
}
