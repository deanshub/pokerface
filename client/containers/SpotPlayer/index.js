import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'
import Spot from '../../components/Spot'
import StepsPlayer from '../../components/StepsPlayer'

import classnames from 'classnames'
import style from './style.css'

@inject('spotPlayer')
@observer
export default class SpotPlayer extends Component {
  render() {
    const {spotPlayer} = this.props
    const currentState = spotPlayer.spotPlayerState

    return (
      <div className={classnames(style.spotPlayerContainer)}>
        <Spot
            currency={currentState.currency}
            dealer={currentState.dealer}
            movesTotal={spotPlayer.spot.moves.length}
            players={currentState.players}
        />
        <StepsPlayer
            onNextStep={()=>spotPlayer.nextStep()}
            onPreviousStep={()=>spotPlayer.previousStep()}
            onReset={()=>spotPlayer.reset()}
        />
      </div>
    )
  }
}
/*
<Sidebar.Pushable>
  <Sidebar
      animation="scale down"
      as={StepsPlayer}
      direction="bottom"
      icon="labeled"
      visible
      onNextStep={()=>spotPlayer.nextStep()}
      onPreviousStep={()=>spotPlayer.previousStep()}
      onReset={()=>spotPlayer.reset()}
  />
  <Sidebar.Pusher>
    <Spot
        currency={currentState.currency}
        dealer={currentState.dealer}
        movesTotal={spotPlayer.spot.moves.length}
        players={currentState.players}
    />
  </Sidebar.Pusher>
</Sidebar.Pushable>
*/
/*

 */
