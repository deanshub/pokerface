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

    this.state = {
      activeTab:'edit',
      wrongFields:{
        error:{},warning:{},
      },
    }
  }

  addGame(e: Object){
    e.preventDefault()
    const { game, events, routing} = this.props

    if (this.validateFields() > 0){
      this.setState({submitted:true})
    }else{
      events.createGame([], game.currentGame)
      .then(res=>{
        if (!res.err){
          game.resetGame()
          routing.push('/events')
          game.closeAddGameModal()
        }
      })
    }
  }

  validateFields(){
    const {game} = this.props
    let wrongFieldCounter = 0

    const uptededWrongFields ={error:{},warning:{}}

    game.fieldsValidations.forEach(validation => {
      const {check, field, level} = validation
      const currentValue = game.currentGame.get(field)
      if (!check(currentValue)){
        uptededWrongFields[level][field] = true
        wrongFieldCounter++
      }
    })

    this.setState({wrongFields:uptededWrongFields})

    return wrongFieldCounter
  }

  handleFieldChange(fieldName, value){
    const {game} = this.props
    const {submitted, wrongFields} = this.state

    // TODO spread
    const uptededFieldState = wrongFields

    if (submitted){

      const validations = game.fieldsValidations.filter(v => v.field === fieldName)

      validations.forEach(validation => {
        const {check, level} = validation
        uptededFieldState[level][fieldName] = !check(value)
      })
    }
    this.setState({wrongFields:uptededFieldState})
  }

  render() {
    const { auth, game } = this.props
    const {activeTab, wrongFields} = this.state

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
                      error={wrongFields.error.title}
                      id="title"
                      label="Title"
                      onChange={(e, {value})=>{
                        game.titleChangeHandler(value)
                        this.handleFieldChange('title', value)
                      }}
                      placeholder="title"
                  />
                  <Select
                      error={wrongFields.error.type}
                      label="Game"
                      onChange={(value)=>{
                        this.handleFieldChange('type', value)
                        game.typeChangeHandler(value)
                      }}
                      options={game.gameTypes}
                      placeholder="game"
                  />
                  <Select
                      error={wrongFields.error.subType}
                      label="Type"
                      onChange={(value)=>{
                        this.handleFieldChange('subType', value)
                        game.subTypeChangeHandler(value)
                      }}
                      options={game.gameSubTypes}
                      placeholder="type"
                  />
                </div>
                <div className={classnames(style.fieldsGroup)}>
                  <Textarea
                      error={wrongFields.error.description}
                      id="description"
                      label="Description"
                      onChange={(e, {value})=>{
                        game.descriptionChangeHandler(value)
                        this.handleFieldChange('description', value)
                      }}
                      placeholder="description"
                  />
                </div>
                <div className={classnames(style.fieldsGroup)}>
                  <Input
                      error={wrongFields.error.location}
                      id="location"
                      label="Location"
                      onChange={(e, {value})=>{
                        game.locationChangeHandler(value)
                        this.handleFieldChange('location', value)
                      }}
                      placeholder="location"
                  />
                </div>
                <div className={classnames(style.fieldsGroup)}>
                  <DatePicker
                      label="From"
                      onChange={(value)=>{
                        game.handleChangeStartDate(value)
                        this.handleFieldChange('startDate', value)
                      }}
                      value={startDate}
                  />
                  <DatePicker
                      label="To"
                      onChange={(value)=>{
                        game.handleChangeEndDate(value)
                        this.handleFieldChange('endDate', value)
                      }}
                      value={endDate}
                  />
                  {
                    auth.publicEventPermission &&
                    <Checkbox
                        checkboxLabel="pubilc"
                        id="public"
                        label="global event?"
                        onChange={(e, {checked})=>{
                          game.publicChangeHandler(checked)
                          this.handleFieldChange('public',checked)
                        }}
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
