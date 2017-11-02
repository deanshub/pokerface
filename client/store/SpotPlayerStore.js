// @flow

import { observable, action } from 'mobx'
import utils from '../containers/SpotPlayer/utils'
import exampleSpot from '../containers/SpotPlayer/exampleSpot'

export class SpotPlayerStore{
  @observable speed
  @observable spotWizardOpen
  @observable newSpot

  constructor(){
    this.speed = 1
    this.spotWizardOpen = false
  }

  @action
  initNewPost(){
    this.newSpot = observable({
      spot:exampleSpot,
      step: 0,
      generalSettings:{
        ante: 0,
        sb: 1,
        bb: 2,
        // currency: '$',
      },
    })
  }
  @action
  cancelNewPost(){
    this.spotWizardOpen=false
    this.newSpot = null
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
    return post
  }
}
