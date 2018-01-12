import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'semantic-ui-react'
import Button from '../basic/Button'
import { observer, inject } from 'mobx-react'
import AddGame from './index'


@inject('game')
@observer
export default class AddGameModal extends Component {
  static propTypes = {
    buttonClassName: PropTypes.string,
    game: PropTypes.shape().isRequired,
  }

  render() {
    const { game } = this.props
    return (
        <Modal
            onClose={() => game.closeAddGameModal()}
            open={game.addGameModalOpen}
            trigger={
                <Button
                    onClick={() => game.openAddGameModal()}
                    primary
                >
                  Create Event
                </Button>}
        >
          <Modal.Header>Create an event</Modal.Header>
          <Modal.Content image>
            <AddGame handleClose={() => game.closeAddGameModal()}/>
          </Modal.Content>
        </Modal>
    )
  }
}
