import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Container, Dimmer, Loader } from 'semantic-ui-react'
import moment from 'moment'
import classnames from 'classnames'
import style from './style.css'

import EventRow from './EventRow'

@inject('events')
@observer
export default class Events extends Component {
  static propTypes = {
    events: PropTypes.shape().isRequired,
  }

  handleToggle(game) {
    const { events } = this.props
    if (game.id === events.expendedGameId) {
      return events.expendedGameId = null
    }

    events.expendedGameId = game.id
  }

  render() {
    const {events} = this.props
    const eventRows = events.games.values()
    .sort((a,b)=>{
      return moment.utc(a.from).diff(moment.utc(b.from))
    })
    .map(game=>{
      const isExpanded = game.id === events.expendedGameId
      return (
        <EventRow
            game={game}
            isExpanded={isExpanded}
            key={game.id}
            onClick={()=>this.handleToggle(game)}
        />
      )
    })

    return (
      <div className={classnames(style.container)}>
        <div>
          {eventRows}
          {!events.loading && events.games.size===0 &&
            <Container text> No game invites found </Container>
          }
          {
            events.loading &&
            <Container text>
              <Dimmer active inverted>
                <Loader>Loading</Loader>
              </Dimmer>
            </Container>
          }
        </div>
      </div>
    )
  }
}
