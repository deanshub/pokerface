import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Grid, Button, Icon, Container } from 'semantic-ui-react'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('events')
@observer
export default class Events extends Component {
  render() {
    const {auth, events} = this.props

    return (
      <div className={classnames(style.container)}>
        <Grid divided="vertically">
          {
            events.games.values().map(game=>{
              return (
                <Grid.Row
                    columns={16}
                    key={game.id}
                    verticalAlign="middle"
                >
                  <Grid.Column width={5}>
                    {game.title}
                  </Grid.Column>
                  <Grid.Column width={4}>
                    {game.location}
                  </Grid.Column>
                  <Grid.Column width={3}>
                    {game.from.toLocaleString()}
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
            })
          }
          {
            events.games.size===0?
            <Container text>
              No games invites found
            </Container>
            :
            undefined
          }
        </Grid>
      </div>
    )
  }
}
