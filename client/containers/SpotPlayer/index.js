import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Sidebar, Segment } from 'semantic-ui-react'
import Spot from '../../components/Spot'
import StepsPlayer from '../../components/StepsPlayer'

// import classnames from 'classnames'
// import style from './style.css'

@inject('spotPlayer')
@observer
export default class SpotPlayer extends Component {
  render() {
    const {spotPlayer} = this.props
    const currentState = spotPlayer.spotPlayerState

    return (
      <Sidebar.Pushable as={Segment}>
        <Sidebar
            animation="push"
            direction="bottom"
            icon="labeled"
            onNextStep={()=>spotPlayer.nextStep()}
            onPreviousStep={()=>spotPlayer.previousStep()}
            onReset={()=>spotPlayer.reset()}
            visible
        >
          <StepsPlayer
              onNextStep={()=>spotPlayer.nextStep()}
              onPreviousStep={()=>spotPlayer.previousStep()}
              onReset={()=>spotPlayer.reset()}
          />
        </Sidebar>
        <Sidebar.Pusher style={{height:'100%'}}>
          <Spot
              currency={currentState.currency}
              dealer={currentState.dealer}
              movesTotal={spotPlayer.spot.moves.length}
              players={currentState.players}
          />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}
