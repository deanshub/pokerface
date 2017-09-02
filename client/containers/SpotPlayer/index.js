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
    const {spotPlayer, style, standalone, post} = this.props

    return (
      <Sidebar.Pushable as={Segment} style={style}>
        <Sidebar
            animation="push"
            direction="bottom"
            icon="labeled"
            visible
        >
          <StepsPlayer
              onNextStep={()=>spotPlayer.nextStep(post)}
              onPreviousStep={()=>spotPlayer.previousStep(post)}
              onReset={()=>spotPlayer.reset(post)}
          />
        </Sidebar>
        <Sidebar.Pusher style={{height:'100%'}}>
          <Spot
              currency={post.spotPlayerState.currency}
              dealer={post.spotPlayerState.dealer}
              movesTotal={post.spot.moves.length}
              players={post.spotPlayerState.players}
              standalone={standalone}
          />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}
