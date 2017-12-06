import React from 'react'
import PropTypes from 'prop-types'
import RSVPGroupBox from './RSVPGroupBox'
import classnames from 'classnames'
import style from './style.css'

const RSVPStatics = ({ game }) => {
  const haveUnknown = game.unresponsive.length > 0
  const classes = classnames({ [style.rsvpStatics]: true, [style.rsvpStaticsNoUnknown]: !haveUnknown })

  return (
    <div className={classes}>
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
    accepted: PropTypes.shape().isRequired,
    declined: PropTypes.shape().isRequired,
    unresponsive: PropTypes.shape().isRequired,
  }).isRequired,
}

export default RSVPStatics
