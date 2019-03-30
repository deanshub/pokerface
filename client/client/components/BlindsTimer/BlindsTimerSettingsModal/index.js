import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal, {ModalHeader, ModalContent, ModalFooter} from '../../basic/Modal'
import Button, {ButtonGroup} from '../../basic/Button'
import Textarea from '../../basic/Textarea'
import Input from '../../basic/Input'
import Checkbox from '../../basic/Checkbox'
import { observer, inject } from 'mobx-react'
import RoundSetting from './RoundSetting'
import classnames from 'classnames'
import style from './style.css'
import {BLINDS_TAB, SLIDESHOW_TAB, TOURNAMENT_TAB} from './constants'

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
              autoWidth
              checkboxLabel="Youtube slide"
              id="enableYoutube"
              onChange={()=>timer.autoSlides.enableYoutube=!timer.autoSlides.enableYoutube}
              style={{flex:'none'}}
              checked={timer.autoSlides.enableYoutube}
          />
          <Checkbox
              checkboxLabel="Auto slides"
              id="autoSlides"
              onChange={::this.toggleAutoSlides}
              style={{flex:'none', alignSelf: 'flex-start', marginTop:'1em'}}
              checked={timer.autoSlides.on}
          />
          <div className={classnames(style.autoSlidesSettingsContainer, {[style.hidden]:!timer.autoSlides.on})}>
            <Input
                label="Blinds time"
                onChange={(e,{value})=>timer.autoSlides.times[0]=parseFloat(value)}
                placeholder={20}
                type="number"
                value={timer.autoSlides.times[0]}
            />
            {
              timer.autoSlides.enableYoutube&&
              <Input
                  label="Youtube"
                  onChange={(e,{value})=>timer.autoSlides.times[1]=parseFloat(value)}
                  placeholder={20}
                  type="number"
                  value={timer.autoSlides.times[1]}
              />
            }
            {
              timer.tournamentManager.on&&
              <Input
                  label="Tournamant details"
                  onChange={(e,{value})=>timer.autoSlides.times[2]=parseFloat(value)}
                  placeholder={20}
                  type="number"
                  value={timer.autoSlides.times[2]}
              />
            }
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
              id="blindsAutoUpdate"
              onChange={::this.toggleAutoUpdate}
              checked={timer.autoUpdateBlinds}
          />
        </ButtonGroup>
      </div>
    )
  }

  getTournamentEditingComponent(){
    const {timer} = this.props
    const {activeTab} = this.state

    return (
      <div className={classnames({[style.hidden]:activeTab!==TOURNAMENT_TAB})}>
        <div className={classnames(style.autoSlidesContainer)}>
          <Input
              containerStyle={{flex:'none'}}
              disable={timer.tournamentManager.on}
              focus
              label="Players amount"
              onChange={(e,{value})=>{
                timer.tournamentManager.playersLeft=parseInt(value)
                timer.tournamentManager.entries=parseInt(value)
                timer.tournamentManager.totalPlayers=parseInt(value)
                timer.tournamentManager.totalChips=timer.tournamentManager.chipsPerPlayer*timer.tournamentManager.totalPlayers
              }}
              type="number"
              value={timer.tournamentManager.playersLeft}
          />
          <Input
              containerStyle={{flex:'none'}}
              disable={timer.tournamentManager.on}
              label="Chips per player"
              onChange={(e,{value})=>{
                timer.tournamentManager.chipsPerPlayer=parseFloat(value)
                timer.tournamentManager.totalChips=timer.tournamentManager.chipsPerPlayer*timer.tournamentManager.totalPlayers
              }}
              type="number"
              value={timer.tournamentManager.chipsPerPlayer}
          />
        </div>
        <Textarea
            dir="auto"
            id="tournamentDescription"
            label="Tournament Text"
            onChange={(e, {value})=>{
              timer.tournamentManager.text = value
            }}
            placeholder="Tournament description\ prize pool\ ..."
            rows={4}
            value={timer.tournamentManager.text}
        />
        <Checkbox
            autoWidth
            centered
            checkboxLabel="Start Tournament Manager"
            id="startTournamentManager"
            onChange={()=>{
              timer.tournamentManager.on=!timer.tournamentManager.on
              if (!timer.autoSlides.times[2]){
                timer.autoSlides.times[2]=20
              }
            }}
            value={timer.tournamentManager.on}
        />
        {/* (when tring to disable add a make sure modal) */}
        <label>After starting the tournament manager the admin is from the tournament slide</label>

          {/* how meny players?
          chips per player?
          add\ remove player (+chip count)

          players left
          how meny entries?
          chip additions?
          avg stack
          chip count
          prize pool
          time elapsed
          next break */}
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
                className={classnames(style.tournamentTab, {[style.active]:(activeTab===TOURNAMENT_TAB)})}
                onClick={() => this.setState({activeTab:TOURNAMENT_TAB})}
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
          {this.getTournamentEditingComponent()}
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
