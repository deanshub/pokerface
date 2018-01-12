import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Loading from '../../components/basic/Loading'
import moment from 'moment'
import classnames from 'classnames'
import style from './style.css'
import AddGameModal from '../../components/AddGame/AddGameModal'

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

    const gamesAmount = events.games.size
    const hasEvents = gamesAmount > 0

    return (
      <div>
        {
          !events.loading &&
          <div className={classnames(style.containerHeader)}>
            <div className={classnames(style.containerHeaderText)}/>
            <AddGameModal buttonClassName={classnames(style.containerHeaderButton)} />
          </div>
        }
        {
          hasEvents&&
          <div className={classnames(style.container)}>{eventRows}</div>
        }
        {
          events.loading &&
          <Loading/>
        }
      </div>
    )
  }
}
