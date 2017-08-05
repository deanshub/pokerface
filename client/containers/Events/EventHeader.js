import React, { PropTypes } from 'react'
import { Button } from 'semantic-ui-react'
import classnames from 'classnames'
import style from './style.css'

import RSVPButton from './RSVPButton'

const EventHeader = ({ game, events, auth, onClick, isExpanded }) => {
  const isCreator = auth.user.username === game.creator.username

  const deleteGame = (e) => {
    e.preventDefault()
    e.stopPropagation()

    events.deleteGame(game)
  }

  const classes = classnames({ [style.eventRowHeader]: true, [style.eventRowHeaderExpanded]: isExpanded })

  return (
      <div className={classes} onClick={onClick}>
        <div className="event-row-remove-button">
          { isCreator && <Button
              basic
              color="red"
              icon="remove"
              onClick={deleteGame}
                         /> }
        </div>
        <div className="event-row-title">
          { game.title }
        </div>
        <div className="event-row-location">
          { !isExpanded && game.location }
        </div>
        <div className={classnames(style.eventRowDate)}>
          { !isExpanded ? game.from.fromNow() : game.from.format('D/M/YYYY H:mm')}
        </div>
        <div>
          { !isExpanded && `${game.invited.length} People invited` }
        </div>
        <div className="rsvp-button">
          <RSVPButton
              auth={auth}
              events={events}
              game={game}
          />
        </div>
      </div>
  )
}

EventHeader.propTypes = {
  auth: PropTypes.shape.isRequired,
  events: PropTypes.arrayOf(PropTypes.shape).isRequired,
  game: PropTypes.shape.isRequired,
  isExpanded: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

export default EventHeader
