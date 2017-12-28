import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Spot from '../../components/Spot'
import StepsPlayer from '../../components/StepsPlayer'
import MOVES from './constants'

import classnames from 'classnames'
import cssStyle from './style.css'

@inject('spotPlayer')
@observer
export default class SpotPlayer extends Component {
  render() {
    const {spotPlayer, style, standalone, post} = this.props
    const steps = post.spot.moves.map(move=>{
      let title
      if (move.action===MOVES.DEALER_ACTIONS.FLOP){
        title='Flop'
      } else if (move.action===MOVES.DEALER_ACTIONS.TURN){
        title='Turn'
      } else if (move.action===MOVES.DEALER_ACTIONS.RIVER){
        title='River'
      }
      return {
        title,
      }
    })

    return (
      <div
          className={classnames(cssStyle.spotPlayerContainer)}
          style={style}
      >
        <div className={classnames(cssStyle.stepsPlayerContainer)}>
          <StepsPlayer
              currentStepIndex={post.spotPlayerState.nextMoveIndex-1}
              hasNextStep={post.spotPlayerState.nextMoveIndex<post.spot.moves.length}
              onNextStep={()=>spotPlayer.nextStep(post)}
              onPreviousStep={()=>spotPlayer.previousStep(post)}
              onReset={()=>spotPlayer.reset(post)}
              steps={steps}
          />
        </div>
        <article className={classnames(cssStyle.spotContainer)}>
          <Spot
              currency={post.spotPlayerState.currency}
              dealer={post.spotPlayerState.dealer}
              movesTotal={post.spot.moves.length}
              players={post.spotPlayerState.players}
              standalone={standalone}
          />
        </article>
      </div>
    )
  }
}
