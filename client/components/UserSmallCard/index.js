// @flow

import React, { Component, PropTypes } from 'react'
import { Header, Image } from 'semantic-ui-react'

export default class UserSmallCard extends Component {
  static propTypes = {
    //user: PropTypes.object,
  }
  render(){
    const {user} = this.props

    return (
      <Header as="h4">
        <Image
            avatar
            src={user.avatar}
            style={{float:'none', width:'3em', height:'3em', borderRadius:'500rem'}}
        />
        {user.fullname}
      </Header>
    )
  }
}
