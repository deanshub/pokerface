import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Grid, Button, Icon, Header } from 'semantic-ui-react'
import MapImage from './MapImage'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('events')
@observer
export default class ExpendedEventRow extends Component {
  deleteGame(game){
    const {events} = this.props
    events.deleteGame(game)
  }

  render(){
    const {game, events, auth, onClick} = this.props

    return (
      <Grid.Row
          className={classnames(style.row, style.expendedrow)}
          columns={16}
          onClick={onClick}
          verticalAlign="top"
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
        <Grid.Column width={13}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={11}>
                <Header size="large">
                  {game.title}
                </Header>
              </Grid.Column>
              <Grid.Column
                  textAlign="right"
                  verticalAlign="top"
                  width={5}
              >
                <Header size="medium">
                  {game.from.format('D/M/YYYY H:mm')}
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={11}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={16}>
                      {game.description}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row divided>
                    <Grid.Column width={5}>
                      <div>{game.accepted.length} Accepted</div>

                    </Grid.Column>
                    <Grid.Column width={5}>
                      <div>{game.declined.length} Declined</div>
                    </Grid.Column>
                    <Grid.Column width={6}>
                      <div>{game.unresponsive.length} Did not respond</div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column textAlign="center" width={5}>
                <MapImage location={game.location} />
                {game.location}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
        <Grid.Column
            verticalAlign="top"
            width={2}
        >
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
