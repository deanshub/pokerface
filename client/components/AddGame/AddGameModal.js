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
import DatePicker from '../basic/DatePicker'

@inject('game')
@inject('players')
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
//<AddGame handleClose={() => game.closeAddGameModal()}/>
  render() {
    const { game, players } = this.props
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
              <div
                  className={classnames(style.usersTab, {[style.active]:(activeTab==='users')})}
                  onClick={() => this.setState({activeTab:'users'})}
              />
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
                      onChange={(value)=>game.titleChangeHandler(value)}
                      options={game.gameTypes}
                      placeholder="game"
                  />
                  <Select
                      label="Type"
                      onChange={(value)=>game.titleChangeHandler(value)}
                      options={game.gameSubTypes}
                      placeholder="type"
                  />
                </div>
                <div className={classnames(style.fieldsGroup)}>
                  <Input
                      id="description"
                      label="Description"
                      onChange={(e, {value})=>game.titleChangeHandler(value)}
                      placeholder="description"
                  />
                </div>
                <div className={classnames(style.fieldsGroup)}>
                  <Input
                      id="location"
                      label="Location"
                      onChange={(e, {value})=>game.titleChangeHandler(value)}
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
                </div>
              </div>
            }
          </ModalContent>
          <ModalFooter>
            <div className={classnames(style.buttons)}>
              <Button primary>Create</Button>
              <Button> Cancel </Button>
            </div>
          </ModalFooter>
        </Modal>
    )
  }
}
