// @flow

import { observable, action, extendObservable } from 'mobx'
import utils from '../containers/SpotPlayer/utils'
import initialSpot from '../containers/SpotPlayer/initialSpot'
import logger from '../utils/logger'
import {getPreviousStep, getNextSteps} from '../utils/game/actions'

export class SpotPlayerStore{
  @observable speed
  @observable spotWizardOpen
  @observable newSpot

  constructor(){
    this.speed = 1
    this.spotWizardOpen = false
    this.newSpot = this.initNewPost()
  }

  initNewPost(owner){
    return observable({
      spot:initialSpot,
      step: 0,
      generalSettings:{
        ante: 0,
        sb: 1,
        bb: 2,
        dealer: 0,
      },
      owner,
    })
  }
  @action
  cancelNewPost(){
    this.spotWizardOpen=false
    this.newSpot = this.initNewPost()
  }
  @action
  openSpotEditing(owner){
    logger.logEvent({category:'Spot',action:'Edit'})
    this.spotWizardOpen=true
    this.newSpot = this.initNewPost(owner)
  }

  @action
  setSpeed(speed){
    this.speed = speed
  }

  @action
  nextStep(post, stepsForward=1){
    const newSpotPlayerState = getNextSteps(post.spot, post.spotPlayerState, stepsForward)
    extendObservable(post, {spotPlayerState: newSpotPlayerState})
    return newSpotPlayerState.nextMoveIndex<post.spot.moves.length
  }

  @action
  previousStep(post, stepsBack=1){
    const newSpotPlayerState = getPreviousStep(post.spot, post.spotPlayerState, stepsBack)
    extendObservable(post, {spotPlayerState: newSpotPlayerState})
    return newSpotPlayerState.nextMoveIndex>0
  }

  @action
  reset(post){
    extendObservable(post, {spotPlayerState: utils.generateInitialState(post.spot)})
    return post
  }
}
