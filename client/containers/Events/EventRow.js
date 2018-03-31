import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Button from '../../components/basic/Button'
import Tooltip from '../../components/basic/Tooltip'
import logger from '../../utils/logger'
import classnames from 'classnames'
import style from './style.css'

@inject('events')
@inject('auth')
@inject('editEvent')
@inject('routing')
@observer
export default class EventRow extends Component {
  static propTypes = {
    game: PropTypes.shape().isRequired,
    isExpanded: PropTypes.bool,
  }

  visitEvent(e){
    const {routing, game} = this.props
    e.stopPropagation()
    if (game.startDate){
      routing.push(`/events/${game.id}`)
    }
  }

  shareEvent(e){
    const {game} = this.props
    e.stopPropagation()
    if (game.startDate){
      logger.logEvent({category:'Event',action:'Facebook share'})
      // const shareurl =`https://www.facebook.com/sharer/sharer.php?u=https://pokerface.io/events/${game.id}&title=Pokerface.io&description=Event scheduled by ${game.creator.fullname}&picture=https://pokerface.io${game.coverImage}}`
      const shareurl =`https://www.facebook.com/sharer/sharer.php?u=https://pokerface.io/events/${game.id}&title=Pokerface.io&description=Event scheduled by ${game.creator.fullname}&picture=https://pokerface.io${require('file-loader!../../assets/logo.png')}`
      window.open(shareurl,'', 'height=570,width=520')
    }else{
      logger.logEvent({category:'Profile',action:'Facebook share'})
      // const shareurl =`https://www.facebook.com/sharer/sharer.php?u=https://pokerface.io/events/${game.username}&title=Pokerface.io&description=${game.fullname} Profile&picture=https://pokerface.io${game.coverImage}}`
      const shareurl =`https://www.facebook.com/sharer/sharer.php?u=https://pokerface.io/profile/${game.username}&title=Pokerface.io&description=${game.fullname} Profile&picture=https://pokerface.io${require('file-loader!../../assets/logo.png')}`
      window.open(shareurl,'', 'height=570,width=520')
    }
  }

  deleteEvent(e){
    const {game, events, routing} = this.props
    e.stopPropagation()
    events.deleteEvent(game)
    routing.push('/events')
  }

  editEvent(){
    const {game, editEvent, events} = this.props
    editEvent.openEditEventModal(events.events.get(game.id))
  }

  render(){
    const { game, auth, events } = this.props
    const details = events.eventToDetails(game)
    const isGoing = details.accepted.find(user=>user.username===auth.user.username)!==undefined
    const isNotGoing = details.declined.find(user=>user.username===auth.user.username)!==undefined
    const isUnresponsive = details.unresponsive.find(user=>user.username===auth.user.username)!==undefined

    return (
      <div className={classnames(style.eventRow, style[auth.theme])}>
        <div className={classnames(style.date)} onClick={::this.visitEvent}>
          <div className={classnames(style.month)}>
            {details.startDate.format('MMMM')}
          </div>
          <div className={classnames(style.day)}>
            {details.startDate.format('DD')}
          </div>
          <div className={classnames(style.yaer)}>
            {details.startDate.year()}
          </div>
        </div>

        <div className={classnames(style.details)}>
          <div className={classnames(style.titleRow)}>
            <div className={classnames(style.title)}>
              {details.title}
            </div>
            <div className={classnames(style.actions)}>
              {
                details.creator&&auth.user&&details.creator.username===auth.user.username&&
                <Tooltip
                    oneClick
                    trigger={
                      <Button
                          leftIcon="actionMenu"
                          small
                      />
                    }
                >
                  <div className={classnames(style.actionMenuItems)}>
                    <Button
                        onClick={::this.deleteEvent}
                        simple
                    >
                      Delete Event
                    </Button>
                    <Button
                        onClick={::this.editEvent}
                        simple
                    >
                      Edit Event
                    </Button>
                  </div>
                </Tooltip>
              }
              <Button
                  leftIcon="share"
                  onClick={::this.shareEvent}
                  small
              />
              <Button
                  leftIcon="visit"
                  onClick={::this.visitEvent}
                  small
              />
            </div>
          </div>

          <div className={classnames(style.location)}>
            {details.location}
          </div>

          <div className={classnames(style.attendance)}>
            {
              details.going>0&&
              <div className={classnames(style.peopleGoingDescription)}>
                {details.going}&nbsp; People Going
              </div>
            }
            {
              details.going>0&&(isUnresponsive||isNotGoing||isGoing)&&
              <div className={classnames(style.peopleDivider)}/>
            }
            {
              (isUnresponsive||isNotGoing||isGoing)&&
              <div className={classnames(style.attandanceContainer)}>
                <div
                    className={classnames(style.attandanceAction, {[style.active]:isUnresponsive}, style.invited)}
                    onClick={()=>events.fillAttendance(auth.user, details.id, null)}
                >
                  Invited
                </div>
                <div
                    className={classnames(style.attandanceAction, {[style.active]:isNotGoing}, style.notGoing)}
                    onClick={()=>events.fillAttendance(auth.user, details.id, false)}
                >
                  Not Going
                </div>
                <div
                    className={classnames(style.attandanceAction, {[style.active]:isGoing}, style.going)}
                    onClick={()=>events.fillAttendance(auth.user, details.id, true)}
                >
                  Going
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
