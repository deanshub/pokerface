// @flow

import React, { Component } from 'react'
import { Modal, Button, Dimmer, Loader } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import SelectUser from '../../components/SelectUser'

@inject('routing')
@inject('auth')
@inject('events')
@inject('timer')
@observer
export default class SelectUserModal extends Component {
  componentWillMount(){
    const {auth, login} = this.props

    if (login){
      auth.fetchOptionalUsersLogin()
    }else{
      auth.fetchOptionalUsersSwitch()
    }
  }

  onSelectUser(userId){
    const {
      auth,
      events,
      routing,
      timer,
      redirectUrl,
      onClose,
    } = this.props

    auth.switchToUser(userId).then(() => auth.refresh()).then(() => {
      events.refresh()
      timer.refresh()
      onClose()
      routing.replace(redirectUrl)
    })
  }

  cancel(){
    this.props.onClose()
  }

  render(){
    const {
      auth:{fetchOptionalUsers, optionalUsers},
      onClose,
    } = this.props

    return (
      <Modal
          onClose={onClose}
          open
          size="mini"
      >
        <Dimmer active={fetchOptionalUsers}>
          <Loader>Loading</Loader>
        </Dimmer>
        <Modal.Header>
          Please choose user
        </Modal.Header>
        <Modal.Content>
          <SelectUser onSelectUser={::this.onSelectUser} users={optionalUsers}/>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={::this.cancel}>
              Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
