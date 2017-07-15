import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Grid, Button, Icon, Container, Dimmer, Loader } from 'semantic-ui-react'
import classnames from 'classnames'
import moment from 'moment'
import style from './style.css'

@inject('auth')
@inject('events')
@observer
export default class Events extends Component {
  deleteGame(game){
    const {events} = this.props
    events.deleteGame(game)
  }

  render() {
    const {auth, events} = this.props

    return (
      <div className={classnames(style.container)}>
        <Grid divided="vertically">
          {
            events.games.values()
            .sort((a,b)=>{
              return moment.utc(a.from).diff(moment.utc(b.from))
            })
            .map(game=>{
              return (
                <Grid.Row
                    columns={16}
                    key={game.id}
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
                  <Grid.Column width={3}>
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
            })
          }
          {
            !events.loading&&events.games.size===0?
            <Container text>
              No games invites found
            </Container>
            :
            undefined
          }
          {
            events.loading?
            <Container text>
              <Dimmer active inverted>
                <Loader>Loading</Loader>
              </Dimmer>
            </Container>
            :
            undefined
          }
        </Grid>
      </div>
    )
  }
}
