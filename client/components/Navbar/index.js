// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import PlayerSearchResult from './PlayerSearchResult'
import Autosuggest from 'react-autosuggest'
import classnames from 'classnames'
import style from './style.css'
import { NavLink } from 'react-router-dom'
import Image from '../basic/Image'
import Input from '../basic/Input'

@inject('globalPlayersSearch')
@inject('routing')
@inject('auth')
@inject('events')
@inject('feed')
@inject('timer')
@observer
export default class Navbar extends Component {

  componentWillMount(){
    this.props.auth.fetchOptionalUsersSwitch()
  }

  componentDidMount(){
    this.props.events.fetchMyGames()
  }

  handleResultSelect(e, selected){
    const {routing, globalPlayersSearch} = this.props
    globalPlayersSearch.searchValue = ''
    routing.push(`/profile/${selected.result.username}`)
  }

  resultRenderer({username, fullname, avatar}){
    return (
      <PlayerSearchResult
          avatar={avatar}
          childKey={username}
          name={fullname}
          username={username}
      />
    )
  }

  // TODO: Consult with Dean
  shouldComponentUpdate(){
    return true
  }

  render() {
    const {globalPlayersSearch, auth, events, routing} = this.props

    return (
      <div className={classnames(style.navbar)}>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              exact
              to="/"
          >
            HOME
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              to="/profile"
          >
            PROFILE
          </NavLink>
          <NavLink
              activeClassName={classnames(style.navbarRouteItemActive)}
              className={classnames(style.navbarRouteItem)}
              to="/events"
          >
            EVENTS
            {
              events.games.size>0?
              events.games.size:
              undefined
            }
          </NavLink>
          <div className={classnames(style.navbarSection)}>
            TOOLS
          </div>
            <NavLink
                activeClassName={classnames(style.navbarRouteItemActive)}
                className={classnames(style.navbarRouteItem)}
                to="/smart"
            >
              PER-FLOP CHART
            </NavLink>
            <NavLink
                activeClassName={classnames(style.navbarRouteItemActive)}
                className={classnames(style.navbarRouteItem)}
                to="/timer"
            >
              BLINDS TIMER
            </NavLink>
            <div className={classnames(style.navbarSection)}>
              SEARCH
            </div>
              {/* <Search
                  as={Input}
                  icon={{ name: 'search', link: true }}
                  loading={globalPlayersSearch.loading}
                  noResultsMessage="No players found"
                  onResultSelect={::this.handleResultSelect}
                  onSearchChange={(e, {value})=>globalPlayersSearch.search(value)}
                  placeholder="Search Users..."
                  resultRenderer={::this.resultRenderer}
                  results={globalPlayersSearch.availablePlayers}
                  style={{marginBottom:2}}
                  transparent
                  value={globalPlayersSearch.searchValue}
              /> */null}

              <Autosuggest
                  getSuggestionValue={player=>player.fullname}
                  highlightFirstSuggestion
                  id="1"
                  inputProps={{
                    placeholder: 'Player',
                    value:globalPlayersSearch.searchValue,
                    onChange: ::this.searchInputChange,
                  }}
                  onSuggestionsClearRequested={()=>globalPlayersSearch.availablePlayers.clear()}
                  onSuggestionsFetchRequested={::this.searchChange}
                  renderInputComponent={(props)=>(
                    <input className={classnames(style.autosuggestInput)} {...props}/>
                  )}
                  renderSuggestion={this.renderSuggestion}
                  suggestions={globalPlayersSearch.immutableAvailablePlayers}
                  theme={{
                    container: classnames(style.autosuggest),
                    suggestionsList: classnames(style.suggestionsList),
                    suggestion: classnames(style.suggestion),
                    suggestionHighlighted: classnames(style.suggestionHighlighted),
                    suggestionsContainer: classnames(style.suggestionsContainer),
                    suggestionsContainerOpen: classnames(style.suggestionsContainerOpen),
                  }}
              />
          </div>
    )
  }

  // onSuggestionSelected={::this.onSuggestionSelected}




  searchChange({value}){
    const {globalPlayersSearch} = this.props
    globalPlayersSearch.search(value)
  }

  renderSuggestion(player,{query}){
    if (!player.guest){
      return(
        <div className={classnames(style.suggestionItem)}>
          <Image
              avatar
              centered
              small
              src={player.avatar}
              target="_blank"
          />
          {player.fullname}
        </div>
      )
    }else{
      return (
        <div className={classnames(style.suggestionItem)}>
          Add &nbsp;<strong>{query}</strong>
        </div>
      )
    }
  }

  onSuggestionSelected(e, {suggestion}){
    const {players, user, playerIndex} = this.props
    players.setPlayer(playerIndex, {...suggestion, cards: user.cards})
  }
  searchInputChange(e,{newValue}){
    const {user} = this.props
    if (!user.guest){
      this.onSuggestionSelected(e, {suggestion:{...user, guest:true, fullname:newValue, username:`guest-${Math.random().toString()}`}})
    }else{
      user.fullname = newValue
    }
  }
}
