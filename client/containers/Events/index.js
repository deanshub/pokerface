import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Grid, Container, Dimmer, Loader } from 'semantic-ui-react'
import EventRow from './EventRow'
import ExpendedEventRow from './ExpendedEventRow'
import moment from 'moment'
import classnames from 'classnames'
import style from './style.css'

@inject('events')
@observer
export default class Events extends Component {
  render() {
    const {events} = this.props
    const eventRows = events.games.values()
    .sort((a,b)=>{
      return moment.utc(a.from).diff(moment.utc(b.from))
    })
    .map(game=>{
      if (game.id===events.expendedGameId){
        return (
          <ExpendedEventRow
              game={game}
              key={game.id}
              onClick={()=>events.expendedGameId=null}
          />
        )
      }
      return (
        <EventRow
            game={game}
            key={game.id}
            onClick={()=>events.expendedGameId=game.id}
        />
      )
    })

    return (
      <div className={classnames(style.container)}>
        <Grid divided="vertically">
          {
            eventRows
          }
          {
            !events.loading&&events.games.size===0?
            <Container text>
              No game invites found
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
