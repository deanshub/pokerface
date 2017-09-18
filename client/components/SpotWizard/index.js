// @flow

import React, { Component, PropTypes } from 'react'
import { Button, Modal, Step, Menu, Icon } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import Spot from '../Spot'
import GeneralSettings from './GeneralSettings'
import SpotPlayer from '../../containers/SpotPlayer'
import MOVES from '../../containers/SpotPlayer/constants'
import utils from '../../containers/SpotPlayer/utils'

@inject('spotPlayer')
@inject('players')
@observer
export default class SpotWizard extends Component {
  cancel(){
    const {spotPlayer} = this.props
    spotPlayer.spotWizardOpen=false
  }
  save(){
    const {spotPlayer} = this.props
    spotPlayer.spotWizardOpen=false
  }

  getMainContent(){
    const {spotPlayer} = this.props
    if (spotPlayer.newSpot.step===0){
      return (
        <GeneralSettings
            settings={spotPlayer.newSpot.generalSettings}
        />
      )
    }else if (spotPlayer.newSpot.step===1) {
      return(
        <Spot
            currency={spotPlayer.newSpot.spotPlayerState.currency}
            dealer={spotPlayer.newSpot.spotPlayerState.dealer}
            movesTotal={spotPlayer.newSpot.spot.moves.length}
            players={spotPlayer.newSpot.spotPlayerState.players}
        />
      )
    }else if (spotPlayer.newSpot.step===2) {
      spotPlayer.reset(spotPlayer.newSpot)
      return (
        <SpotPlayer post={spotPlayer.newSpot} />
      )
    }
  }

  nextStep(){
    if (this.nextStepDisabled()) return undefined
    const {spotPlayer, players} = this.props
    // console.log(players.currentPlayers, spotPlayer.newSpot.spot.players);
    if (spotPlayer.newSpot.step===0){
      spotPlayer.newSpot.spot.players = players.currentPlayers.values().map((player, playerIndex)=>{
        spotPlayer.newSpot.spot.cards[playerIndex] = player.cards
        return {
          bank: 100,
          ...player,
        }
      })
      spotPlayer.newSpot.spot.ante=spotPlayer.newSpot.generalSettings.ante||0
      // TODO:normalize spotPlayer.newSpot.generalSettings.currency
      spotPlayer.newSpot.spot.currency=MOVES.CURRENCIES.DOLLAR
      spotPlayer.newSpot.spot.moves=[
        {
          player:0,
          action:MOVES.PLAYER_META_ACTIONS.DEALER,
        },
        // {
        //   player:0,
        //   action:MOVES.PLAYER_META_ACTIONS.SHOWS,
        // },
        // {
        //   player:1,
        //   action:MOVES.PLAYER_ACTIONS.SMALLBLIND,
        //   value: spotPlayer.newSpot.generalSettings.sb,
        // },
        // {
        //   player:0,
        //   action:MOVES.PLAYER_ACTIONS.BIGBLIND,
        //   value: spotPlayer.newSpot.generalSettings.bb,
        // },
      ]

      spotPlayer.reset(spotPlayer.newSpot)
    }
    spotPlayer.newSpot.step++
  }

  previousStep(){
    if (this.previousStepDisabled()) return undefined
    const {spotPlayer} = this.props
    spotPlayer.newSpot.step--
  }

  nextStepDisabled(){
    const {spotPlayer, players} = this.props
    if (spotPlayer.newSpot.step>1){
      return true
    }else if (spotPlayer.newSpot.step===0 && players.currentPlayersArray.length<2){
      return true
    }
    return false
  }
  previousStepDisabled(){
    const {spotPlayer} = this.props
    return spotPlayer.newSpot.step===0
  }

  showCards(){
    const {spotPlayer} = this.props
    spotPlayer.newSpot.spot.moves.push({
      player: utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState),
      action: MOVES.PLAYER_META_ACTIONS.SHOWS,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
  }
  smallBlind(){
    const {spotPlayer} = this.props
    spotPlayer.newSpot.spot.moves.push({
      player: utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState),
      action: MOVES.PLAYER_ACTIONS.SMALLBLIND,
      value: spotPlayer.newSpot.generalSettings.sb,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState.totalRaise = spotPlayer.newSpot.generalSettings.sb
  }
  bigBlind(){
    const {spotPlayer} = this.props
    spotPlayer.newSpot.spot.moves.push({
      player: utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState),
      action: MOVES.PLAYER_ACTIONS.BIGBLIND,
      value: spotPlayer.newSpot.generalSettings.bb,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState.totalRaise = spotPlayer.newSpot.generalSettings.bb
  }
  call(){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.CALL,
      value: spotPlayer.newSpot.spotPlayerState.totalRaise - spotPlayer.newSpot.spotPlayerState.players[player].bet,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
  }
  fold(){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.FOLD,
    })

    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
  }
  check(){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.CHECK,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
  }
  raise(){
    const {spotPlayer} = this.props
    const player = utils.getCurrentTurnPlayerIndex(spotPlayer.newSpot.spotPlayerState)
    // TODO: change value
    spotPlayer.newSpot.spot.moves.push({
      player,
      action:MOVES.PLAYER_ACTIONS.RAISE,
      value: 10 - spotPlayer.newSpot.spotPlayerState.players[player].bet,
    })
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState = utils.getNextStep(spotPlayer.newSpot.spot, spotPlayer.newSpot.spotPlayerState)
    spotPlayer.newSpot.spotPlayerState.totalRaise = 10
  }

  render(){
    const {spotPlayer, players} = this.props

    return (
      <Modal
          dimmer="blurring"
          open={spotPlayer.spotWizardOpen}
          size="fullscreen"
      >
        <Modal.Header>
          <Step.Group fluid size="tiny">
            <Step
                active={spotPlayer.newSpot.step===0}
                description="Configure general spot parameters"
                icon="dollar"
                title="General"
            />
            <Step
                active={spotPlayer.newSpot.step===1}
                description="Set players moves"
                disabled={players.currentPlayersArray.length<2}
                icon="users"
                title="Moves"
            />
            <Step
                active={spotPlayer.newSpot.step===2}
                description="Verify spot details"
                disabled
                icon="unhide"
                title="Overview"
            />
          </Step.Group>
        </Modal.Header>
        <Modal.Content style={{height:'80vh'}}>
          {this.getMainContent()}
        </Modal.Content>
        <Modal.Actions>
          <Menu>
            <Menu.Menu>
              <Menu.Item
                  disabled={spotPlayer.newSpot.step<1}
                  name="prev"
                  onClick={::this.previousStep}
              >
                <Icon name="arrow left" />
                Previous Step
              </Menu.Item>
              <Menu.Item
                  disabled={this.nextStepDisabled()}
                  name="next"
                  onClick={::this.nextStep}
              >
                <Icon name="arrow right" />
                Next Step
              </Menu.Item>
            </Menu.Menu>

            <Menu.Menu style={{borderLeft:'3px solid rgba(34,36,38,.1)'}}>
              <Menu.Item
                  disabled={false}
                  name="smallblind"
                  onClick={::this.smallBlind}
              >
                <Icon.Group>
                  <Icon name="money" />
                  <Icon corner name="minus" />
                </Icon.Group>
                Small Blind
              </Menu.Item>
              <Menu.Item
                  disabled={false}
                  name="bigblind"
                  onClick={::this.bigBlind}
              >
                <Icon.Group>
                  <Icon name="money" />
                  <Icon corner name="plus" />
                </Icon.Group>
                Big Blind
              </Menu.Item>
            </Menu.Menu>

            <Menu.Menu position="right" style={{borderRight:'1px solid rgba(34,36,38,.1)'}}>
              <Menu.Item
                  disabled={false}
                  name="fold"
                  onClick={::this.fold}
              >
                <Icon.Group>
                  <Icon name="hand paper" />
                  <Icon corner name="dollar" />
                </Icon.Group>
                Fold
              </Menu.Item>
              <Menu.Item
                  disabled={false}
                  name="call"
                  onClick={::this.call}
              >
                <Icon.Group>
                  <Icon name="hand rock" />
                  <Icon corner name="dollar" />
                </Icon.Group>
                Call
              </Menu.Item>
              <Menu.Item
                  disabled={false}
                  name="check"
                  onClick={::this.check}
              >
                <Icon.Group>
                  <Icon name="hand rock" />
                  <Icon corner name="dollar" />
                </Icon.Group>
                Check
              </Menu.Item>
              <Menu.Item
                  disabled={false}
                  name="raise"
                  onClick={::this.raise}
              >
                <Icon.Group>
                  <Icon name="hand lizard" />
                  <Icon corner name="dollar" />
                </Icon.Group>
                Raise
              </Menu.Item>
            </Menu.Menu>

            <Menu.Menu position="right">
              <Menu.Item
                  disabled={false}
                  name="showcards"
                  onClick={::this.showCards}
              >
                <Icon name="eye" />
                Show Cards
              </Menu.Item>
              <Menu.Item>
                <Button
                    content="Cancel"
                    icon="close"
                    labelPosition="right"
                    negative
                    onClick={::this.cancel}
                />
              </Menu.Item>
              <Menu.Item>
                <Button
                    content="Save"
                    disabled={this.previousStepDisabled()}
                    icon="checkmark"
                    labelPosition="right"
                    onClick={::this.save}
                    positive
                />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Modal.Actions>
      </Modal>
    )
  }

}
