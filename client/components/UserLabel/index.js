import React, { Component, PropTypes } from 'react'
import { Icon, Label } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('players')
@observer
export default class UserLabel extends Component {
  static propTypes = {
    user: PropTypes.object,
    players: PropTypes.object,
  }

  render() {
    const { players, user } = this.props

    return (
      <Label image>
        <img src={user.image} />
        {user.name}
        <Icon name="delete" onClick={()=>players.removePlayer(user.user)} />
      </Label>
    )
  }
}
