// @flow

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import Cover from '../../components/Cover'
import ProfileNavbar from '../../components/ProfileNavbar'
// import Post from '../../components/Post'
import Feed from '../Feed'
// import * as BoardActions from '../../ducks/board'
import { observer, inject } from 'mobx-react'

@inject('auth')
@observer
export default class Profile extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  }

  render() {
    const { auth } = this.props

    return (
      <div className={classnames(style.container)}>
        <Cover
            image={auth.user.coverImage}
            title={auth.user.displayName}
        />
        <ProfileNavbar
            avatar={auth.user.avatarImage}
        />

        <Feed/>
      </div>
    )
  }
}
