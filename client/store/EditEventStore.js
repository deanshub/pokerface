import { observable, action, computed, toJS } from 'mobx'
import moment from 'moment'
import { INVITATION_STATUS } from '../constants/event'

export class EditEventStore {
  @observable currentEvent
  @observable addGameModalOpen
  @observable editEventModalOpen

  constructor(){
    this.editEventModalOpen = false
    this.currentEvent = this.newEvent()
    this.lastNewEvent = this.currentEvent

    // find another place
    const notEmpty = (value) => !!value
    const createValidation = (field, level, check) => ({field, level, check})

    this.fieldsValidations = [
      createValidation('title', 'error', notEmpty),
      createValidation('type', 'error', notEmpty),
      createValidation('subtype', 'error', notEmpty),
      createValidation('description', 'error', notEmpty),
      createValidation('location', 'error', notEmpty),
      createValidation('startDate', 'error', notEmpty),
      createValidation('endDate', 'error', notEmpty),
    ]

    this.gameTypes = [{
      text: 'Texas Hold\'em',
      value: 'Texas Hold\'em',
    },{
      text: 'Omaha High',
      value: 'Omaha High',
    },{
      text: 'Omaha Hi\\Lo',
      value: 'Omaha Hi\\Lo',
    },{
      text: 'Seven Card Stud',
      value: 'Seven Card Stud',
    },{
      text: 'Razz',
      value: 'Razz',
    },{
      text: 'Five Card Draw',
      value: 'Five Card Draw',
    },{
      text: 'Deuce to Seven Triple Draw',
      value: 'Deuce to Seven Triple Draw',
    },{
      text: 'Badugi',
      value: 'Badugi',
    },{
      text: 'H.O.R.S.E.',
      value: 'H.O.R.S.E.',
    }]

    this.gameSubTypes = [{
      text: 'Tournement',
      value: 'Tournement',
    },{
      text: 'Cash',
      value: 'Cash',
    }]
  }

  @action handleChangeStartDate(startDate){
    this.currentEvent.set('startDate', startDate)
    this.currentEvent.set('endDate', startDate)
  }
  @action handleChangeEndDate(endDate){
    this.currentEvent.set('endDate', endDate)
  }

  @action resetGame(){
    this.currentEvent = this.newEvent()
  }

  typeChangeHandler(type){
    this.currentEvent.set('type', type)
  }
  subTypeChangeHandler(subtype){
    this.currentEvent.set('subtype', subtype)
  }
  locationChangeHandler(location){
    this.currentEvent.set('location', location)
  }
  descriptionChangeHandler(description){
    this.currentEvent.set('description', description)
  }
  titleChangeHandler(title){
    this.currentEvent.set('title', title)
  }
  publicChangeHandler(isPublic){
    this.currentEvent.set('isPublic', isPublic)
  }

  invitePlayer(player){
    this.currentEvent.get('invited').push(player)
  }

  removePlayer(username){
    const index = this.currentEvent.get('invited').findIndex(p => p.username === username)
    this.currentEvent.get('invited').splice(index, 1)
  }

  newEvent(){
    return observable.map({
      startDate: moment(),
      endDate: moment(),
      invited: [],
      accepted: [],
      declined: [],
    })
  }

  @action
  openEditEventModal(event) {
    this.editEventModalOpen = true
    if (!event) {
      this.currentEvent = this.lastNewEvent
    }else{

      // save the last new edit event
      if (event.id && !this.currentEvent.id) {
        this.lastNewEvent = this.currentEvent
      }

      this.currentEvent = observable.map(toJS(event))
    }
  }

  @action
  closeEditEventModal() {
    this.editEventModalOpen = false
  }

  @computed
  get involvedPlayersStatus(){

    const statusToPlayer = new Map()
    const unresponsive = this.currentEvent.get('unresponsive')
    const accepted = this.currentEvent.get('accepted')
    const declined = this.currentEvent.get('declined')
    const {
      INVITED,
      GONING,
      //MAYBE,
      NOT_GOING,
    } = INVITATION_STATUS

    accepted.forEach(({username}) => {
      statusToPlayer.set(username, GONING)
    })

    declined.forEach(({username}) => {
      statusToPlayer.set(username, NOT_GOING)
    })

    unresponsive.forEach(({username}) => {
      statusToPlayer.set(username, INVITED)
    })

    return statusToPlayer
  }

  @computed
  get formFields(){
    const {
      id,
      title,
      type,
      subtype,
      description,
      location,
      startDate,
      endDate,
      coverImage,
    } = toJS(this.currentEvent)

    return {
      id,
      title,
      type,
      subtype,
      description,
      location,
      startDate:moment(startDate),
      endDate:moment(endDate),
      coverImage,
    }
  }
}
