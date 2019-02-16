import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Loader from '../../components/basic/Loader'
import Button from '../../components/basic/Button'
import moment from 'moment'
import classnames from 'classnames'
import style from './style.css'
import EditEvent from '../EditEvent'

import EventRow from './EventRow'

@inject('events')
@inject('editEvent')
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
    const {events, editEvent} = this.props
    const eventRows = Object.values(events.events.toJSON())
    .sort((a,b)=>{
      return moment.utc(new Date(a.from)).diff(moment.utc(new Date(b.from)))
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

    const eventsAmount = events.events.size
    const hasEvents = eventsAmount > 0

    return (
      <div className={classnames(style.events)}>
        {
          !events.loading &&
          <div className={classnames(style.containerHeader)}>
            <div className={classnames(style.containerHeaderText)}/>
            <Button
                active
                onClick={() => editEvent.openEditEventModal()}
                simple
            >
              CREATE EVENT
            </Button>
            {editEvent.editEventModalOpen && <EditEvent/>}
          </div>
        }
        {
          hasEvents&&
          <div className={classnames(style.container)}>{eventRows}</div>
        }
        {
          events.loading &&
          <Loader/>
        }
      </div>
    )
  }
}
