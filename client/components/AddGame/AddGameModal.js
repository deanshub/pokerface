import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'semantic-ui-react'
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
                    className={this.props.buttonClassName}
                    onClick={() => game.openAddGameModal()}
                    primary
                    size="small"
                >
                  Add Event
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
