import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal, {ModalHeader, ModalContent, ModalFooter} from '../../basic/Modal'
import Button, {ButtonGroup} from '../../basic/Button'
import Input from '../../basic/Input'
import Checkbox from '../../basic/Checkbox'
import { observer, inject } from 'mobx-react'
import RoundSetting from './RoundSetting'
import classnames from 'classnames'
import style from './style.css'
import {BLINDS_TAB, SLIDESHOW_TAB} from './constants'

@inject('timer')
@observer
export default class BlindsTimer extends Component {
  static propTypes ={
    timer: PropTypes.shape(),
  }

  constructor(props){
    super(props)
    this.state = {
      activeTab: BLINDS_TAB,
    }
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

  toggleAutoSlides(){
    const {timer} = this.props
    timer.autoSlides.on = !timer.autoSlides.on
  }

  getSlideshowEditingComponent(){
    const {timer} = this.props
    const {activeTab} = this.state
    return (
      <div className={classnames({[style.hidden]:activeTab!==SLIDESHOW_TAB})}>
        <div className={classnames(style.autoSlidesContainer)}>
          <Checkbox
              checkboxLabel="Auto slides"
              onChange={::this.toggleAutoSlides}
              style={{flex:'none', alignSelf: 'flex-start', marginTop:'1em'}}
              value={timer.autoSlides.on}
          />
          <div className={classnames(style.autoSlidesContainer, {[style.hidden]:!timer.autoSlides.on})}>
            <Input
                label="Blinds time"
                onChange={(e,{value})=>timer.autoSlides.times[0]=parseFloat(value)}
                placeholder={20}
                type="number"
                value={timer.autoSlides.times[0]}
            />
            <Input
                label="Youtube time"
                onChange={(e,{value})=>timer.autoSlides.times[1]=parseFloat(value)}
                placeholder={20}
                type="number"
                value={timer.autoSlides.times[1]}
            />
          </div>
        </div>
      </div>
    )
  }

  getBlindsEditingComponent(){
    const {timer} = this.props
    const {activeTab} = this.state
    return (
      <div className={classnames({[style.hidden]:activeTab!==BLINDS_TAB})}>
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
            wrapReverse
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
      </div>
    )
  }

  render() {
    const {timer} = this.props
    const {activeTab} = this.state

    return (
      <Modal
          onClose={::this.closeModal}
          open={timer.settingsModalOpen}
      >
        <ModalHeader>
          <div className={classnames(style.header)}>
            <div className={classnames(style.title)}>Edit Blinds</div>
            <div
                className={classnames(style.blindsTab, {[style.active]:(activeTab===BLINDS_TAB)})}
                onClick={() => this.setState({activeTab:BLINDS_TAB})}
            />
            <div
                className={classnames(style.slideshowTab, {[style.active]:(activeTab===SLIDESHOW_TAB)})}
                onClick={() => this.setState({activeTab:SLIDESHOW_TAB})}
            />
          </div>
        </ModalHeader>
        <ModalContent>
          {this.getBlindsEditingComponent()}
          {this.getSlideshowEditingComponent()}
        </ModalContent>
        <ModalFooter>
          <ButtonGroup
              horizontal
              noEqual
              reversed
          >
            <Button onClick={::this.saveSetting} primary>Save</Button>
            <Button onClick={::this.closeModal}> Cancel </Button>
          </ButtonGroup>
        </ModalFooter>

      </Modal>
    )
  }
}
