// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import Cover from '../Cover'
import Feed from '../../containers/Feed'

@inject('auth')
@inject('profile')
@observer
export default class Profile extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params:PropTypes.shape({
        username:PropTypes.string,
      }),
    }),
  }

  componentDidMount(){
    const {auth, profile, match} = this.props
    const {params:{username}} = match
    profile.setCurrentUser(username||auth.user)
    document.body.scrollTop = 0

    if (username === auth.user.username){
      profile.updateLastProfileVisit()
    }
  }

  componentWillReceiveProps(props){
    const {auth, profile, match} = props
    const {params:{username}} = match
    profile.setCurrentUser(username||auth.user)
  }

  render() {
    const { profile, match } = this.props
    const user = profile.currentUser
    const {username} = match.params

    return (
      <div className={classnames(style.container)}>
        <Cover details={user}/>
        <Feed by={{username}}/>
      </div>
    )
  }
}
