import React, { Component, PropTypes } from 'react'
import { Modal, Button, Header } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('timer')
@observer
export default class BlindTimerResetModal extends Component {
  static propTypes ={
    timer: PropTypes.shape(),
  }

  reset(){
    const {timer} = this.props
    timer.setResetRespose(true)
  }

  notReset(){
    const {timer} = this.props
    timer.setResetRespose(false)
  }

  render() {
    const {timer} = this.props

    return (
      <Modal
          dimmer={false}
          mountNode={timer.resetModalMountNode}
          open={timer.recovered}
          size="tiny"
      >
        <Header
            content="The timer is active"
            icon="repeat"
            size="large"
            subheader="Would you like to reset the timer?"
        />
        <Modal.Actions>
          <Button onClick={::this.notReset}>
            No
          </Button>
          <Button onClick={::this.reset}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
