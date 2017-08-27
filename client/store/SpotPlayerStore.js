// @flow

import { observable, action } from 'mobx'
import utils from '../containers/SpotPlayer/utils'
import exampleSpot from '../containers/SpotPlayer/exampleSpot'

export class SpotPlayerStore{
  @observable spot
  @observable spotPlayerState
  @observable speed
  @observable auto

  constructor(){
    this.speed = 1
    this.spot = exampleSpot
    this.spotPlayerState = utils.generateInitialState(this.spot)
  }

  @action
  setSpeed(speed){
    this.speed = speed
  }

  @action
  nextStep(){
    const newSpotPlayerState = utils.getNextStep(this.spot, this.spotPlayerState)
    this.spotPlayerState = newSpotPlayerState
  }

  @action
  previousStep(){
    const newSpotPlayerState = utils.getPreviousStep(this.spot, this.spotPlayerState)
    this.spotPlayerState = newSpotPlayerState
  }

  @action
  reset(){
    this.spotPlayerState = utils.generateInitialState(this.spot)
  }
}
