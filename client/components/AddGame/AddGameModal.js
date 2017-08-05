import React, { Component, PropTypes } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import AddGame from './index'

export default class AddGameModal extends Component {
  static propTypes = {
    buttonClassName: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = { isOpen: false }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({ isOpen: true })
  }

  closeModal() {
    this.setState({ isOpen: false })
  }

  render() {
    return (
        <Modal
            onClose={this.closeModal}
            open={this.state.isOpen}
            trigger={
                <Button
                    className={this.props.buttonClassName}
                    onClick={this.openModal}
                    primary
                    size="small"
                >
                  Add Event
                </Button>}
        >
          <Modal.Header>Create an event</Modal.Header>
          <Modal.Content image>
            <AddGame handleClose={this.closeModal}/>
          </Modal.Content>
        </Modal>
    )
  }
}
