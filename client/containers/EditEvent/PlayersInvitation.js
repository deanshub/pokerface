import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Autosuggest from 'react-autosuggest'
import Image from '../../components/basic/Image'
import Button from '../../components/basic/Button'

import { INVITATION_STATUS } from '../../constants/event'
import classnames from 'classnames'
import style from './style.css'

@inject('editEvent')
@inject('globalPlayersSearch')
@observer
export default class PlayersInvitation extends Component {

  constructor(props){
    super(props)

    this.state = {
      invitedStatusActive:INVITATION_STATUS.INVITED,
      searchValue:'',
      searchInputFocused: false,
    }
  }

  searchInputChange(e,{newValue, method}){
    if (method ==='type'){
      this.setState({searchValue:newValue})
    }
  }

  onSearchInputBlur(){
    this.setState({searchInputFocused:false})
  }

  renderSuggestion(player, {query}){
    const {editEvent} = this.props
    const playerStatus = editEvent.involvedPlayersStatus.get(player.username)

    return (player.guest)?
      <div className={classnames(style.suggestionItem)}>
        Add &nbsp;<strong>{query}</strong>
      </div>
      :
      (!playerStatus)?
        <div className={classnames(style.suggestionItem, style.notInvitedPlayerItem)}>
          <Image avatar src={player.avatar}/>
          <div className={classnames(style.name)}>{player.fullname}</div>
          <div className={classnames(style.status)}>Invited</div>
        </div>
        :
        <div className={classnames(style.suggestionItem, style.invitedPlayerItem)}>
          <Image avatar src={player.avatar}/>
          <div className={classnames(style.name)}>{player.fullname}</div>
          <div className={classnames(style.remove)}/>
        <div className={classnames(style.status)}>{playerStatus}</div>
      </div>
  }

  searchChange({value}){
    const {globalPlayersSearch} = this.props
    globalPlayersSearch.search(value)
  }

  onSuggestionSelected(e, {suggestion}){
    const {editEvent} = this.props
    const playerStatus = editEvent.involvedPlayersStatus.get(suggestion.username)

    // if playerStatus === NOT_INVITED
    if (!playerStatus){
      editEvent.invitePlayer(suggestion)
    }else{
      editEvent.removePlayer(suggestion.username, playerStatus)
    }

    this.setState({searchValue:''})
  }

  render(){
    const { editEvent, hidden, globalPlayersSearch} = this.props
    const {invitedStatusActive, searchValue, searchInputFocused} = this.state
    const { INVITED, GONING, NOT_GOING } = INVITATION_STATUS
    const {currentEvent} = editEvent

    const InvitedStatus = ({status, count}) => {
      return (
        <div
            className={classnames(style.guestStatusTab, {[style.active]:invitedStatusActive === status})}
            onClick={() => this.setState({invitedStatusActive:status})}
        >
          <div>{status}</div>
          <div>{count}</div>
        </div>
      )
    }

    // filter by current status
    let inviteds
    if (invitedStatusActive === GONING) {
      inviteds = currentEvent.get('accepted')
    } else if (invitedStatusActive ===  NOT_GOING) {
      inviteds = currentEvent.get('declined')
    } else {
      inviteds = currentEvent.get('unresponsive')
    }

    const noGuest = (inviteds.length === 0)
    return (
      <div className={classnames(style.playersInvitationContainer, {[style.hidden]:hidden})}>
        <Autosuggest
            focusInputOnSuggestionClick={false}
            getSuggestionValue={event=>event.username}
            inputProps={{
              placeholder: 'Search players...',
              value:searchValue,
              onChange: ::this.searchInputChange,
              onBlur: ::this.onSearchInputBlur,
              onFocus: () => {this.setState({searchInputFocused:true})},
            }}
            onSuggestionSelected={::this.onSuggestionSelected}
            onSuggestionsClearRequested={()=>{
              globalPlayersSearch.availablePlayers.clear()
            }}
            onSuggestionsFetchRequested={::this.searchChange}
            renderInputComponent={(props)=>(
              <div className={classnames(style.inputContainer, {[style.inputContainerFocused]:searchInputFocused})}>
                <input {...props}/>
                <div className={classnames(style.searchImg)}/>
              </div>
            )}
            renderSuggestion={::this.renderSuggestion}
            suggestions={globalPlayersSearch.immutableAvailablePlayers.concat([{guest:true, avatar:'images/avatar.png', fullname:searchValue, username:`guest-${Math.random().toString()}`}])}

            theme={{
              input: classnames(style.autosuggestInput),
              container: classnames(style.autosuggest),
              suggestionsList: classnames(style.suggestionsList),
              suggestion: classnames(style.suggestion),
              suggestionHighlighted: classnames(style.suggestionHighlighted),
              suggestionsContainer: classnames(style.suggestionsContainer),
              suggestionsContainerOpen: classnames(style.suggestionsContainerOpen),
            }}
        />
        <div className={classnames(style.guestStatusMenu)}>
          <InvitedStatus count={currentEvent.get('unresponsive').length} status={INVITED}/>
          <InvitedStatus count={currentEvent.get('accepted').length} status={GONING}/>
          <InvitedStatus count={currentEvent.get('declined').length} status={NOT_GOING}/>
        </div>
        <div className={classnames(style.playersList, {[style.playersListNoGuests]:noGuest})}>
          {
            noGuest?
              <div className={classnames(style.noPlayersMessage)}>
                Search players to invite them to the event
              </div>
            :
            inviteds.map((player) => {
              return (
                <div className={classnames(style.invitedPlayerItem)} key={player.username}>
                  <Image avatar src={player.avatar}/>
                  <div className={classnames(style.name)}>{player.fullname}</div>
                  <Button
                      leftIcon="remove"
                      onClick={() => editEvent.removePlayer(player.username)}
                  />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
