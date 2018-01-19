// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Button from '../../components/basic/Button'
import Cover from '../../components/Cover'
import Feed from '../Feed'
import NoMatch from '../../components/NoMatch'
import Logo from '../../components/Logo'
import IsUserLoggedIn from '../../components/IsUserLoggedIn'
import EditEvent from '../EditEvent'

@inject('auth')
@inject('profile')
@inject('events')
@inject('routing')
@inject('editEvent')
@observer
export default class Event extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params:PropTypes.shape({
        username:PropTypes.string,
      }),
    }),
  }

  componentDidMount(){
    const {match, profile, events} = this.props
    const {params:{eventId}} = match
    events.setCurrentEvent(eventId)
    profile.setCurrentUser(undefined)
    document.body.scrollTop = 0
  }

  componentWillReceiveProps(props){
    const {events, profile, match} = props
    const {params:{eventId}} = match
    // TODO: check if updated? (maybe not because it will cause a get update for the same event)
    profile.setCurrentUser(undefined)
    events.setCurrentEvent(eventId)
  }

  componentWillUnmount(){
    this.props.events.clearCurrentEvent()
  }

  goHome(){
    event.preventDefault()
    const { routing } = this.props
    routing.push('/')
  }

  render() {
    const { events, auth, editEvent } = this.props
    const {loadingCurrentEvent, currentEventDetails} = events

    if (!loadingCurrentEvent && !currentEventDetails){
      return (
        <NoMatch />
      )
    }else if (!loadingCurrentEvent && currentEventDetails){
      return (
        <div style={{margin:auth.user.username?undefined:'0 10em'}}>
          <IsUserLoggedIn opposite>
            <a href="/" onClick={::this.goHome}>
              <Logo />
            </a>
          </IsUserLoggedIn>
          <Cover details={currentEventDetails}/>
          {editEvent.editEventModalOpen && <EditEvent/>}
          <IsUserLoggedIn opposite>
            <Button
                href={`/login?url=/events/${currentEventDetails.id}`}
                primary
                style={{width:'30em', textTransform:'uppercase', margin: '0 auto', marginBottom: '3em'}}
            >
              Join The Pokerface Community - Sign Up
            </Button>
          </IsUserLoggedIn>
          <Feed by={{eventId: currentEventDetails.id}}/>
        </div>
      )
    }else if(loadingCurrentEvent){
      return null
    }
  }
}
