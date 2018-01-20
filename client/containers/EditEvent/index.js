import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Modal, {ModalHeader,ModalContent,ModalFooter}  from '../../components/basic/Modal'
import Button from '../../components/basic/Button'
import Input from '../../components/basic/Input'
import Select from '../../components/basic/Select'
import Textarea from '../../components/basic/Textarea'
import DatePicker from '../../components/basic/DatePicker'
import Checkbox from '../../components/basic/Checkbox'
import PlayersInvitation from './PlayersInvitation'
import {FORM_TAB, INVITATION_TAB} from '../../constants/event'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('editEvent')
@inject('events')
@inject('routing')
@observer
export default class EditEvent extends Component {
  static propTypes = {
    editEvent: PropTypes.shape().isRequired,
  }

  constructor(props){
    super(props)

    this.state = {
      activeTab:FORM_TAB,
      wrongFields:{
        error:{},warning:{},
      },
      ...props.editEvent.formFields,
    }
  }

  saveEvent(e: Object){
    e.preventDefault()
    const { editEvent, events, routing} = this.props

    if (this.validateFields() > 0){
      this.setState({submitted:true, activeTab:FORM_TAB})
    }else{
      events.saveEvent(editEvent.currentEvent)
      .then(res=>{
        if (!res.err){
          editEvent.resetGame()
          routing.push('/events')
          editEvent.closeEditEventModal()
        }
      })
    }
  }

  validateFields(){
    const {editEvent} = this.props
    let wrongFieldCounter = 0

    const uptededWrongFields ={error:{},warning:{}}

    editEvent.fieldsValidations.forEach(validation => {
      const {check, field, level} = validation
      const currentValue = editEvent.currentEvent.get(field)
      if (!check(currentValue)){
        uptededWrongFields[level][field] = true
        wrongFieldCounter++
      }
    })

    this.setState({wrongFields:uptededWrongFields})

    return wrongFieldCounter
  }

  handleFieldChange(fieldName, value){
    const {editEvent} = this.props
    const {submitted, wrongFields} = this.state

    // TODO spread
    const uptededFieldState = wrongFields

    if (submitted){
      const validations = editEvent.fieldsValidations.filter(v => v.field === fieldName)

      validations.forEach(validation => {
        const {check, level} = validation
        uptededFieldState[level][fieldName] = !check(value)
      })
    }
    this.setState({[fieldName]:value, wrongFields:uptededFieldState})
  }

  getForm(){
    const {auth, editEvent } = this.props
    const {activeTab, wrongFields} = this.state
    const endDate = editEvent.currentEvent.get('endDate')

    return (
      <div className={classnames({[style.hidden]:activeTab!==FORM_TAB})}>
        <div className={classnames(style.fieldsGroup)}>
          <Input
              error={wrongFields.error.title}
              id="title"
              label="Title"
              onChange={(e, {value})=>{
                editEvent.titleChangeHandler(value)
                this.handleFieldChange('title', value)
              }}
              placeholder="title"
              value={this.state.title}
          />
          <Select
              error={wrongFields.error.type}
              label="Game"
              onChange={(value)=>{
                this.handleFieldChange('type', value)
                editEvent.typeChangeHandler(value)
              }}
              options={editEvent.gameTypes}
              placeholder="game"
              value={this.state.type}
          />
          <Select
              error={wrongFields.error.subtype}
              label="Type"
              onChange={(value)=>{
                this.handleFieldChange('subtype', value)
                editEvent.subTypeChangeHandler(value)
              }}
              options={editEvent.gameSubTypes}
              placeholder="type"
              value={this.state.subtype}
          />
        </div>
        <div className={classnames(style.fieldsGroup)}>
          <Textarea
              error={wrongFields.error.description}
              id="description"
              label="Description"
              onChange={(e, {value})=>{
                editEvent.descriptionChangeHandler(value)
                this.handleFieldChange('description', value)
              }}
              placeholder="description"
              value={this.state.description}
          />
        </div>
        <div className={classnames(style.fieldsGroup)}>
          <Input
              error={wrongFields.error.location}
              id="location"
              label="Location"
              onChange={(e, {value})=>{
                editEvent.locationChangeHandler(value)
                this.handleFieldChange('location', value)
              }}
              placeholder="location"
              value={this.state.location}
          />
        </div>
        <div className={classnames(style.fieldsGroup)}>
          <DatePicker
              label="From"
              onChange={(value)=>{
                editEvent.handleChangeStartDate(value)
                this.handleFieldChange('startDate', value)
              }}
              value={this.state.startDate}
          />
          <DatePicker
              label="To"
              onChange={(value)=>{
                editEvent.handleChangeEndDate(value)
                //this.handleFieldChange('endDate', value)
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
                  editEvent.publicChangeHandler(checked)
                  this.handleFieldChange('public',checked)
                }}
                type="checkbox"
                value={this.state.public}
            />
          }
        </div>
      </div>
    )
  }
  render() {
    const {editEvent} = this.props
    const {activeTab} = this.state

    return (
        <Modal
            onClose={() => editEvent.closeEditEventModal()}
            open={editEvent.editEventModalOpen}
        >
          <ModalHeader>
            <div className={classnames(style.header)}>
              <div className={classnames(style.title)}>Create Event</div>
              <div
                  className={classnames(style.editTab, {[style.active]:(activeTab===FORM_TAB)})}
                  onClick={() => this.setState({activeTab:FORM_TAB})}
              />
              <div
                  className={classnames(style.usersTab, {[style.active]:(activeTab===INVITATION_TAB)})}
                  onClick={() => this.setState({activeTab:INVITATION_TAB})}
              />
            </div>
          </ModalHeader>
          <ModalContent>
            <PlayersInvitation hidden={activeTab!==INVITATION_TAB}/>
            {this.getForm()}
          </ModalContent>
          <ModalFooter>
            <div className={classnames(style.buttons)}>
              <Button onClick={::this.saveEvent} primary>Save</Button>
              <Button onClick={() => editEvent.closeEditEventModal()}> Cancel </Button>
            </div>
          </ModalFooter>
        </Modal>
    )
  }
}
