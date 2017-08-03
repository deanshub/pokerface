// @flow

import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import Cover from '../Cover'
import ProfileNavbar from '../ProfileNavbar'
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
  }

  componentWillReceiveProps(props){
    const {auth, profile, match} = props
    const {params:{username}} = match
    profile.setCurrentUser(username||auth.user)
  }

  render() {
    const { profile } = this.props
    const user = profile.currentUser

    return (
      <div className={classnames(style.container)}>
        <Cover
            imageFile={user.get('imageFile')}
            title={user.get('fullname')}
        />
        <ProfileNavbar
            avatarImage={user.get('avatarImage')}
        />
        <Feed username={user.get('username')}/>
      </div>
    )
  }
}
