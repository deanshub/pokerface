import React, { PropTypes } from 'react'
import RSVPGroupBox from './RSVPGroupBox'
import classnames from 'classnames'
import style from './style.css'

const RSVPStatics = ({ game }) => {
  return (
    <div className={classnames(style.rsvpStatics)}>
      <RSVPGroupBox group={game.accepted} groupName="Accepted" />
      <RSVPGroupBox group={game.declined} groupName="Declined" />
      <RSVPGroupBox
          group={game.unresponsive}
          groupName="Did not respond"
          hideWhenEmpty
      />
    </div>
  )
}

RSVPStatics.propTypes = {
  game: PropTypes.shape({
    accepted: PropTypes.shape.isRequired,
    declined: PropTypes.shape.isRequired,
    unresponsive: PropTypes.shape.isRequired,
  }).isRequired,
}

export default RSVPStatics
