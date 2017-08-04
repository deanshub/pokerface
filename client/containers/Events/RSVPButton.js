import React, { PropTypes } from 'react'
import { Button, Icon } from 'semantic-ui-react'

export default ({ auth, game, events }) => {
  const handleNotGoing = (e) => {
    e.preventDefault()
    e.stopPropagation()
    events.fillAttendance(auth.user.username, game.id, false)
  }

  const handleGoing = (e) => {
    e.preventDefault()
    e.stopPropagation()
    events.fillAttendance(auth.user.username, game.id, true)
  }

  const isGoing = game.accepted.filter(user=>user.username===auth.user.username).length>0
  const isNotGoing = game.declined.filter(user=>user.username===auth.user.username).length>0

  return (
    <Button.Group className="is-going-button">
      <Button
          animated
          negative={isNotGoing}
          onClick={handleNotGoing}
      >
        <Button.Content visible>Not Going</Button.Content>
        <Button.Content hidden>
          <Icon name="thumbs outline down" />
        </Button.Content>
      </Button>
      <Button.Or />
      <Button
          animated
          onClick={handleGoing}
          positive={isGoing}
      >
        <Button.Content visible>Going</Button.Content>
        <Button.Content hidden>
          <Icon name="thumbs outline up" />
        </Button.Content>
      </Button>
    </Button.Group>
  )
}
