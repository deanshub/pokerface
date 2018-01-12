import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal, {ModalHeader,ModalContent,ModalFooter}  from '../basic/Modal'
import Button from '../basic/Button'
import { observer, inject } from 'mobx-react'
import PlayersInvitation from './PlayersInvitation'
import classnames from 'classnames'
import style from './style.css'
import Input from '../basic/Input'
import Select from '../basic/Select'
import Textarea from '../basic/Textarea'
import DatePicker from '../basic/DatePicker'
import Checkbox from '../basic/Checkbox'

@inject('auth')
@inject('game')
@inject('events')
@inject('routing')
@observer
export default class AddGameModal extends Component {
  static propTypes = {
    buttonClassName: PropTypes.string,
    game: PropTypes.shape().isRequired,
  }

  constructor(props){
    super(props)

    this.state = {activeTab:'edit'}
  }

  addGame(e: Object){
    e.preventDefault()
    const { game, events, routing} = this.props
    events.createGame([], game.currentGame)
    .then(res=>{
      if (!res.err){
        game.resetGame()
        routing.push('/events')
        game.closeAddGameModal()
      }
    })
  }

  render() {
    const { auth, game } = this.props
    const {activeTab} = this.state

    const startDate = game.currentGame.get('startDate')
    const endDate = game.currentGame.get('endDate')

    return (
        <Modal
            onClose={() => game.closeAddGameModal()}
            open={game.addGameModalOpen}
        >
          <ModalHeader>
            <div className={classnames(style.header)}>
              <div className={classnames(style.title)}>Create Event</div>
              <div
                  className={classnames(style.editTab, {[style.active]:(activeTab==='edit')})}
                  onClick={() => this.setState({activeTab:'edit'})}
              />
              {/* <div
                  className={classnames(style.usersTab, {[style.active]:(activeTab==='users')})}
                  onClick={() => this.setState({activeTab:'users'})}
              /> */}
            </div>
          </ModalHeader>
          <ModalContent>
            {
              (activeTab==='users')?
                <PlayersInvitation/>
              :
              <div>
                <div className={classnames(style.fieldsGroup)}>
                  <Input
                      id="title"
                      label="Title"
                      onChange={(e, {value})=>game.titleChangeHandler(value)}
                      placeholder="title"
                  />
                  <Select
                      label="Game"
                      onChange={(value)=>game.typeChangeHandler(value)}
                      options={game.gameTypes}
                      placeholder="game"
                  />
                  <Select
                      label="Type"
                      onChange={(value)=>game.subTypeChangeHandler(value)}
                      options={game.gameSubTypes}
                      placeholder="type"
                  />
                </div>
                <div className={classnames(style.fieldsGroup)}>
                  <Textarea
                      id="description"
                      label="Description"
                      onChange={(e, {value})=>game.descriptionChangeHandler(value)}
                      placeholder="description"
                  />
                </div>
                <div className={classnames(style.fieldsGroup)}>
                  <Input
                      id="location"
                      label="Location"
                      onChange={(e, {value})=>game.locationChangeHandler(value)}
                      placeholder="location"
                  />
                </div>
                <div className={classnames(style.fieldsGroup)}>
                  <DatePicker
                      label="From"
                      onChange={(startDate)=>game.handleChangeStartDate(startDate)}
                      value={startDate}
                  />
                  <DatePicker
                      label="To"
                      onChange={(endDate)=>game.handleChangeEndDate(endDate)}
                      value={endDate}
                  />
                  {
                    auth.publicEventPermission &&
                    <Checkbox
                        checkboxLabel="pubilc"
                        id="public"
                        label="publiclication"
                        onChange={(e, {checked})=>game.publicChangeHandler(checked)}
                        type="checkbox"
                    />
                  }
                </div>
              </div>
            }
          </ModalContent>
          <ModalFooter>
            <div className={classnames(style.buttons)}>
              <Button onClick={::this.addGame} primary>Create</Button>
              <Button onClick={() => game.closeAddGameModal()}> Cancel </Button>
            </div>
          </ModalFooter>
        </Modal>
    )
  }
}
