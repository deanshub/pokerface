// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Modal, { ModalHeader, ModalContent, ModalFooter } from '../../components/basic/Modal'
import Button, {ButtonGroup} from '../../components/basic/Button'
import UserSmallCard from '../../components/UserSmallCard'
import classnames from 'classnames'
import style from './style.css'

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
          compact
          onClose={onClose}
          open
      >
        <ModalHeader>
          Please choose user
        </ModalHeader>
        <ModalContent>
          {optionalUsers.map((user) => (
            <div
                className={classnames(style.optionalUsers)}
                key={user.username}
                onClick={() => this.onSelectUser(user.username)}
            >
                <UserSmallCard header={user.fullname} image={user.avatar}/>
            </div>
          ))}
        </ModalContent>
        <ModalFooter>
          <ButtonGroup
              horizontal
              noEqual
              reversed
          >
            <Button onClick={::this.cancel}>
                Cancel
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    )
  }
}
