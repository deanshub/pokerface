import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'

import EventHeader from './EventHeader'
import MapImage from './MapImage'
import RSVPStatics from './RSVPStatics'

@inject('auth')
@inject('events')
@observer
export default class EventRow extends Component {
  propTypes = {
    game: PropTypes.shape.isRequired,
    isExpanded: PropTypes.bool,
  }

  render(){
    const { game, isExpanded } = this.props
    return (
      <div className={classnames(style.eventPanel)}>
        <EventHeader {...this.props} />
        { isExpanded &&
          <div className={classnames(style.eventDetails)}>
            <div className={classnames(style.eventDetailsLeft)}>
              <div className={classnames(style.eventDescription)}>
                { game.description }
              </div>
              <RSVPStatics game={game} />
            </div>
              <div className={classnames(style.eventDetailsRight)}>
                <MapImage location={game.location} />
                <h4 className={classnames(style.eventLocation)}>{game.location}</h4>
              </div>
          </div> }
      </div>
    )
  }
}
