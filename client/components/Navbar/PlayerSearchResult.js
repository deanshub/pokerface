// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Header, Image } from 'semantic-ui-react'

export default class PlayerSearchResult extends Component {
  static propTypes = {
    avatar: PropTypes.string,
    name: PropTypes.string,
  }
  render(){
    const {name, avatar} = this.props

    return (
      <Header as="h4">
        <Image
            avatar
            src={avatar}
            style={{float:'none', width:'3em', height:'3em', borderRadius:'500rem'}}
        />
        {name}
        <Header.Subheader
            style={{marginTop:7,marginBottom:-7}}
        >
          2 Mutual friends
        </Header.Subheader>
      </Header>
    )
  }
}
