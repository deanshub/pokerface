// import { observable, action } from 'mobx'

export class GameStore {
  constructor(){
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
}
