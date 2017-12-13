import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Spot from '../../components/Spot'
import StepsPlayer from '../../components/StepsPlayer'

import classnames from 'classnames'
import cssStyle from './style.css'

@inject('spotPlayer')
@observer
export default class SpotPlayer extends Component {
  render() {
    const {spotPlayer, style, standalone, post} = this.props
    return (
      <div
          className={classnames(cssStyle.spotPlayerContainer)}
          style={style}
      >
        <div className={classnames(cssStyle.stepsPlayerContainer)}>
          <StepsPlayer
              hasNextStep={post.spotPlayerState.nextMoveIndex<post.spot.moves.length}
              onNextStep={()=>spotPlayer.nextStep(post)}
              onPreviousStep={()=>spotPlayer.previousStep(post)}
              onReset={()=>spotPlayer.reset(post)}
          />
        </div>
        <div className={classnames(cssStyle.spotContainer)}>
          <Spot
              currency={post.spotPlayerState.currency}
              dealer={post.spotPlayerState.dealer}
              movesTotal={post.spot.moves.length}
              players={post.spotPlayerState.players}
              standalone={standalone}
          />
        </div>
      </div>
    )
  }
}
