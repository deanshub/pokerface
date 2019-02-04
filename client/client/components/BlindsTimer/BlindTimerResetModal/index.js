import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Modal, {ModalHeader, ModalContent, ModalFooter} from '../../basic/Modal'
import Button, {ButtonGroup} from '../../basic/Button'
import classnames from 'classnames'
import style from './style.css'

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
          compact
          open={timer.recovered}
      >
        <ModalHeader>The timer is active</ModalHeader>
        <ModalContent>
          <div className={classnames(style.message)}>
            Would you like to reset the timer?
          </div>
        </ModalContent>
        <ModalFooter>
          <ButtonGroup
              horizontal
              noEqual
              reversed
          >
            <Button className={classnames(style.yes)} onClick={::this.reset}>Yes</Button>
            <Button className={classnames(style.no)} onClick={::this.notReset}>No</Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    )
  }
}
