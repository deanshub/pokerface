import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Grid, Button, Icon } from 'semantic-ui-react'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('events')
@observer
export default class EventRow extends Component {
  deleteGame(game){
    const {events} = this.props
    events.deleteGame(game)
  }

  render(){
    const {game, events, auth, onClick} = this.props

    return (
      <Grid.Row
          className={classnames(style.row)}
          columns={16}
          onClick={onClick}
          verticalAlign="middle"
      >
        <Grid.Column width={1}>
          {
            auth.user.username===game.creator.username?
            <Button
                basic
                color="red"
                icon="remove"
                onClick={()=>this.deleteGame(game)}
            />
            :
            undefined
          }
        </Grid.Column>
        <Grid.Column width={4}>
          {game.title}
        </Grid.Column>
        <Grid.Column width={4}>
          {game.location}
        </Grid.Column>
        <Grid.Column style={{textTransform:'capitalize'}} width={3}>
          {game.from.fromNow()}
        </Grid.Column>
        <Grid.Column width={2}>
          {game.invited.length} People invited
        </Grid.Column>
        <Grid.Column width={2}>
          <Button.Group>
            <Button
                animated
                negative={game.declined.includes(auth.user.username)}
                onClick={()=>{events.fillAttendance(auth.user.username, game.id, false)}}
            >
              <Button.Content visible>Not Going</Button.Content>
              <Button.Content hidden>
                <Icon name="thumbs outline down" />
              </Button.Content>
            </Button>
            <Button.Or />
            <Button
                animated
                onClick={()=>{events.fillAttendance(auth.user.username, game.id, true)}}
                positive={game.accepted.includes(auth.user.username)}
            >
              <Button.Content visible>Going</Button.Content>
              <Button.Content hidden>
                <Icon name="thumbs outline up" />
              </Button.Content>
            </Button>
          </Button.Group>
        </Grid.Column>
      </Grid.Row>
    )
  }
}
