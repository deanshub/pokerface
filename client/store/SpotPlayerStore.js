// @flow

import { observable, action } from 'mobx'
import utils from '../containers/SpotPlayer/utils'

export class SpotPlayerStore{
  @observable speed

  constructor(){
    this.speed = 1
  }

  @action
  setSpeed(speed){
    this.speed = speed
  }

  @action
  nextStep(post){
    const newSpotPlayerState = utils.getNextStep(post.spot, post.spotPlayerState)
    post.spotPlayerState = newSpotPlayerState
    return newSpotPlayerState.nextMoveIndex<post.spot.moves.length
  }

  @action
  previousStep(post){
    const newSpotPlayerState = utils.getPreviousStep(post.spot, post.spotPlayerState)
    post.spotPlayerState = newSpotPlayerState
    return newSpotPlayerState.nextMoveIndex>0
  }

  @action
  reset(post){
    post.spotPlayerState = utils.generateInitialState(post.spot)
  }
}
