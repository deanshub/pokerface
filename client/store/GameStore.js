import { observable, action } from 'mobx'
import moment from 'moment'

export class GameStore {
  @observable currentGame
  @observable addGameModalOpen

  constructor(){
    this.currentGame = observable.map({
      startDate: moment(),
      endDate: moment(),
    })

    this.addGameModalOpen = false

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
    this.currentGame.set('startDate', startDate)
    this.currentGame.set('endDate', startDate)
  }
  @action handleChangeEndDate(endDate){
    this.currentGame.set('endDate', endDate)
  }

  @action resetGame(){
    this.currentGame = observable.map({
      startDate: moment(),
      endDate: moment(),
    })
  }

  typeChangeHandler(type){
    this.currentGame.set('type', type)
  }
  subTypeChangeHandler(subType){
    this.currentGame.set('subType', subType)
  }
  locationChangeHandler(location){
    this.currentGame.set('location', location)
  }
  descriptionChangeHandler(description){
    this.currentGame.set('description', description)
  }
  titleChangeHandler(title){
    this.currentGame.set('title', title)
  }
  publicChangeHandler(isPublic){
    this.currentGame.set('isPublic', isPublic)
  }

  @action
  openAddGameModal() {
    this.addGameModalOpen = true
  }

  @action
  closeAddGameModal() {
    this.addGameModalOpen = false
  }
}
