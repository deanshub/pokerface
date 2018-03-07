import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal, {ModalHeader, ModalContent, ModalFooter} from '../../basic/Modal'
import Button, {ButtonGroup} from '../../basic/Button'
import Checkbox from '../../basic/Checkbox'
import { observer, inject } from 'mobx-react'
import RoundSetting from './RoundSetting'
import classnames from 'classnames'
import style from './style.css'

@inject('timer')
@observer
export default class BlindsTimer extends Component {
  static propTypes ={
    timer: PropTypes.shape(),
  }

  closeModal(){
    const {timer} = this.props
    timer.settingsModalOpen = false
    timer.resetEditedRounds()
  }

  addRound(){
    const {timer} = this.props
    timer.addRound()
  }

  addBreak(){
    const {timer} = this.props
    timer.addBreak()
  }

  toggleAutoUpdate(){
    const {timer} = this.props
    timer.autoUpdateBlinds = !timer.autoUpdateBlinds
  }

  saveSetting(){
    this.props.timer.saveRoundsUpdate()
    this.closeModal()
  }

  render() {
    const {open, timer} = this.props

    return (
      <Modal
          onClose={::this.closeModal}
          open={timer.settingsModalOpen}
      >
        <ModalHeader>
          Edit Blinds
        </ModalHeader>
        <ModalContent>
          {
            timer.editedRounds.map((round, roundIndex)=>
            <RoundSetting
                key={Math.random()}
                round={round}
                roundIndex={roundIndex}
            />)
          }
          <ButtonGroup
              horizontal
              noEqual
          >
            <Button className={classnames(style.editRoundButton)} onClick={::this.addRound}>Add Round</Button>
            <Button className={classnames(style.editRoundButton)} onClick={::this.addBreak}>Add Break</Button>
            <Checkbox
                centered
                checkboxLabel="Update blinds"
                onChange={::this.toggleAutoUpdate}
                value={timer.autoUpdateBlinds}
            />
          </ButtonGroup>
        </ModalContent>
        <ModalFooter>
          <ButtonGroup
              horizontal
              noEqual
              reversed
              uppercase
          >
            <Button onClick={::this.saveSetting} primary>Save</Button>
            <Button onClick={::this.closeModal}> Cancel </Button>
          </ButtonGroup>
        </ModalFooter>

      </Modal>
    )
  }
}
