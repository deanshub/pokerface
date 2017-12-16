// @flow

import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import SelectUser from '../SelectUser'

@inject('routing')
@inject('auth')
@observer
export default class SelectUserModal extends Component {
  componentWillMount(){
    this.props.auth.authenticate().then(()=>{
      this.forceUpdate()
    })
  }

  render(){
    const {
      onClose,
      redirectUrl,
      auth,
      routing,
    } = this.props

    const onSelectUser = (userId) => {
      const {user} = auth
      if (user.id === userId){
        routing.replace(redirectUrl)
      }else{
        auth.switchToOrganization(userId).then(() => auth.refresh()).then(() => {
          routing.replace(redirectUrl)
        })
      }
    }

    const cancel = () => {
      auth.logout() // TODO to do this?
      onClose()
    }

    return (auth.authenticating?null:
      <Modal
          onClose={onClose}
          open
          size="mini"
      >
        <Modal.Header>
          Please choose user
        </Modal.Header>
        <Modal.Content>
          <SelectUser onSelectUser={onSelectUser}/>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={cancel}>
              Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
