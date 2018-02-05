// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import QRCode from 'qrcode.react'
import classnames from 'classnames'
import style from './style.css'
import Button from '../basic/Button'
import Image from '../basic/Image'
import DropDown from '../basic/DropDown'
import dateIcon from '../../assets/profile/date-gray.png'
import mapIcon from '../../assets/profile/map.png'
import userIcon from '../../assets/profile/user-search.png'
import qrLogo from '../../assets/qr-logo.png'
import logger from '../../utils/logger'
import COLORS from '../../constants/styles.css'

@inject('events')
@inject('editEvent')
@inject('routing')
@inject('auth')
@observer
export default class Cover extends Component {
  static propTypes = {
    compact: PropTypes.bool,
    imageFile: PropTypes.string,
    title: PropTypes.string,
  }

  static defaultProps = {
    compact: false,
  }

  constructor(props){
    super(props)
    this.state= {
      editingPersonalInfo: false,
      qrOpen: false,
      expanded: false,
    }
  }

  visitEvent(e){
    const {routing, details} = this.props
    e.stopPropagation()
    routing.push(`/events/${details.id}`)
  }

  shareEvent(e){
    const {details} = this.props
    e.stopPropagation()
    if (details.startDate){
      logger.logEvent({category:'Event',action:'Facebook share'})
      // const shareurl =`https://www.facebook.com/sharer/sharer.php?u=http://pokerface.io/events/${details.id}&title=Pokerface.io&description=Event scheduled by ${details.creator.fullname}&picture=http://pokerface.io${details.coverImage}}`
      const shareurl =`https://www.facebook.com/sharer/sharer.php?u=http://pokerface.io/events/${details.id}&title=Pokerface.io&description=Event scheduled by ${details.creator.fullname}&picture=http://pokerface.io${require('file-loader!../../assets/logo.png')}`
      window.open(shareurl,'', 'height=570,width=520')
    }else{
      logger.logEvent({category:'Profile',action:'Facebook share'})
      // const shareurl =`https://www.facebook.com/sharer/sharer.php?u=http://pokerface.io/events/${details.username}&title=Pokerface.io&description=${details.fullname} Profile&picture=http://pokerface.io${details.coverImage}}`
      const shareurl =`https://www.facebook.com/sharer/sharer.php?u=http://pokerface.io/profile/${details.username}&title=Pokerface.io&description=${details.fullname} Profile&picture=http://pokerface.io${require('file-loader!../../assets/logo.png')}`
      window.open(shareurl,'', 'height=570,width=520')
    }
  }

  deleteEvent(e){
    const {details, events, routing} = this.props
    e.stopPropagation()
    events.deleteEvent(details)
    routing.push('/events')
  }

  editEvent(){
    const {details, editEvent, events} = this.props
    editEvent.openEditEventModal(events.events.get(details.id))
  }

  getDetailsElement(){
    const {details, compact, auth, events} = this.props
    const {qrOpen, expanded} = this.state

    const isGoing = details.accepted.find(user=>user.username===auth.user.username)!==undefined
    const isNotGoing = details.declined.find(user=>user.username===auth.user.username)!==undefined
    const isUnresponsive = details.unresponsive.find(user=>user.username===auth.user.username)!==undefined

    const parsedLocation = (details.location||'').replace(/^\s+/,'').replace(/\s+$/,'').replace(/\s+/g,' ').replace(/\s*,\s*/g,',').replace(/\s/g,'+')

    return (
      <div className={classnames(style.detailsContainer, {[style.hidden]:compact&&!expanded})}>
        <div className={classnames(style.detailsLeftPane)}>
          <div className={classnames(style.detailsText, style.noTopMargin)}>
            {details.subtype?`${details.subtype} - `:''}{details.type}
          </div>
          <div className={classnames(style.detailsText)}>
            {details.description}
          </div>
          <div className={classnames(style.divider)}/>
          {
            details.startDate.toString()&&
            <div className={classnames(style.detailsText)}>
              <img className={classnames(style.icon)} src={dateIcon}/> {details.startDate.format('D/M/YYYY H:mm')}&nbsp;{`(${details.startDate.fromNow()})`}
            </div>
          }
          {
            details.location&&
            <div className={classnames(style.detailsText)}>
              <img className={classnames(style.icon)} src={mapIcon}/> {details.location} &nbsp;&nbsp; <a href={`https://www.google.com/maps/search/${parsedLocation}`} target="_blank">See Map</a>
            </div>
          }

          <div className={classnames(style.detailsText)}>
            {
              details.going>0&&
              <div className={classnames(style.peopleGoingDescription)}>
                <img className={classnames(style.icon)} src={userIcon}/> {details.going}&nbsp; People Going
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
        <div className={classnames(style.detailsRightPane)}>
          <img
              className={classnames(style.imgIcon)}
              onClick={()=>this.setState({qrOpen:!qrOpen})}
              src={qrLogo}
          />
        </div>
      </div>
    )
  }

  render() {
    const {details, auth, compact, editEvent} = this.props
    const {expanded, qrOpen} = this.state

    let coverDivStyle = {}
    if (details.coverImage){
      coverDivStyle.backgroundImage=`url(${details.coverImage})`
    }

    let detailsLeftPaneText= null
    if (compact){
      detailsLeftPaneText=expanded?'Hide Details':'Show Details'
    }


    return (
      <div className={classnames(style.coverContainer,{[style.compact]:compact})}>
        <div
            className={classnames(style.imageContainer,{[style.coverImageNotExist]: details.fullname && !details.coverImage})}
            onClick={::this.visitEvent}
            style={coverDivStyle}
        >
          <div className={classnames(style.name)}>{details.fullname}</div>
          {
            details.avatar&&
            <Image
                avatar
                big
                className={classnames(style.avatar)}
                src={details.avatar}
            />
          }
        </div>
        {
          qrOpen&&
          <div className={classnames(style.qrContainer)} onClick={()=>this.setState({qrOpen:false})}>
            <QRCode
                bgColor={COLORS.backColor}
                fgColor={COLORS.textColor}
                size={526}
                value={`${window.location.protocol}//${window.location.host}/events/${details.id}`}
            />
          </div>
        }
        {
          details.startDate&&
          this.getDetailsElement()
        }
        <div className={classnames(style.expandablePanel)} onClick={()=>this.setState({expanded:!expanded})}>
          <div className={classnames(style.detailsLeftPane)}>
            <a>{detailsLeftPaneText}</a>
          </div>
          <div className={classnames(style.detailsRightPane)}>
            {
              details.creator&&auth.user&&details.creator.username===auth.user.username&&
              <DropDown
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
              </DropDown>
            }
            <Button
                leftIcon="share"
                onClick={::this.shareEvent}
                small
            />
            {
              compact&&
              <Button
                  leftIcon="visit"
                  onClick={::this.visitEvent}
                  small
              />
            }
          </div>
        </div>
      </div>
    )
  }
}
