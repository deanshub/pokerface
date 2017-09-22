import React, { Component, PropTypes } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import classnames from 'classnames'
import style from './style.css'
import { observer, inject } from 'mobx-react'

@inject('events')
@inject('auth')
@observer
export default class RSVPButton extends Component {
  handleNotGoing(e) {
    e.preventDefault()
    e.stopPropagation()
    const {events, auth, game } = this.props
    events.fillAttendance(auth.user, game.id, false)
  }

  handleGoing(e) {
    e.preventDefault()
    e.stopPropagation()
    const {events, auth, game } = this.props
    events.fillAttendance(auth.user, game.id, true)
  }

  handleUnresponsive(e) {
    e.preventDefault()
    e.stopPropagation()
    const {events, auth, game } = this.props
    events.fillAttendance(auth.user, game.id, null)
  }

  render(){
    const {game, auth } = this.props
    const isGoing = game.accepted.find(user=>user.username===auth.user.username)!==undefined
    const isNotGoing = game.declined.find(user=>user.username===auth.user.username)!==undefined
    const isUnresponsive = game.unresponsive.find(user=>user.username===auth.user.username)!==undefined

    return (
      <Button.Group>
        <Button
            animated
            className={classnames(style.isGoingButton)}
            negative={isNotGoing}
            onClick={::this.handleNotGoing}
        >
          <Button.Content visible>Not Going</Button.Content>
          <Button.Content hidden>
            <Icon name="thumbs outline down" />
          </Button.Content>
        </Button>
        <Button.Or />
        <Button
            animated
            className={classnames(style.isGoingButton)}
            color={isUnresponsive?'yellow':undefined}
            onClick={::this.handleUnresponsive}
        >
          <Button.Content visible>Maybe</Button.Content>
          <Button.Content hidden>
            <Icon name="help" />
          </Button.Content>
        </Button>
        <Button.Or />
        <Button
            animated
            className={classnames(style.isGoingButton)}
            onClick={::this.handleGoing}
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
}
