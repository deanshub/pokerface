// @flow

import { observable, action, extendObservable } from 'mobx'
import utils from '../containers/SpotPlayer/utils'
import initialSpot from '../containers/SpotPlayer/initialSpot'
import logger from '../utils/logger'

export class SpotPlayerStore{
  @observable speed
  @observable spotWizardOpen
  @observable newSpot

  constructor(){
    this.speed = 1
    this.spotWizardOpen = false
    this.newSpot = this.initNewPost()
  }

  initNewPost(){
    return observable({
      spot:initialSpot,
      step: 0,
      generalSettings:{
        ante: 0,
        sb: 1,
        bb: 2,
        dealer: 0,
      },
    })
  }
  @action
  cancelNewPost(){
    this.spotWizardOpen=false
    this.newSpot = this.initNewPost()
  }
  @action
  openSpotEditing(){
    logger.logEvent({category:'Spot',action:'Edit'})
    this.spotWizardOpen=true
    this.newSpot = this.initNewPost()
  }

  @action
  setSpeed(speed){
    this.speed = speed
  }

  @action
  nextStep(post){
    const newSpotPlayerState = utils.getNextStep(post.spot, post.spotPlayerState)
    extendObservable(post, {spotPlayerState: newSpotPlayerState})
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
    extendObservable(post, {spotPlayerState: utils.generateInitialState(post.spot)})
    return post
  }
}
