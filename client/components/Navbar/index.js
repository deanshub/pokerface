// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Autosuggest from 'react-autosuggest'
import classnames from 'classnames'
import style from './style.css'
import { NavLink } from 'react-router-dom'
import UserSmallCard from '../UserSmallCard'

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

  // TODO: Consult with Dean
  shouldComponentUpdate(){
    return true
  }

  searchChange({value}){
    const {globalPlayersSearch} = this.props
    globalPlayersSearch.search(value)
  }

  renderSuggestion(player){
    return (
        <UserSmallCard
            className={style.suggestionItem}
            header={player.fullname}
            image={player.avatar}
            subheader="2 mutuals friends"
        />
    )
  }

  onSuggestionSelected(e, {suggestion}){
    const {routing, globalPlayersSearch} = this.props
    globalPlayersSearch.searchValue = ''
    routing.push(`/profile/${suggestion.username}`)
  }

  searchInputChange(e,{newValue}){
    const {globalPlayersSearch} = this.props

    globalPlayersSearch.search(newValue)
  }

  render() {
    const {globalPlayersSearch, auth, events, routing} = this.props
    const {username} = auth.user

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
              to={`/profile/${username}`}
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

            <Autosuggest
                getSuggestionValue={player=>player.fullname}
                highlightFirstSuggestion
                id="1"
                inputProps={{
                  placeholder: 'Player',
                  value:globalPlayersSearch.searchValue,
                  onChange: ::this.searchInputChange,
                }}
                onSuggestionSelected={::this.onSuggestionSelected}
                onSuggestionsClearRequested={()=>globalPlayersSearch.availablePlayers.clear()}
                onSuggestionsFetchRequested={::this.searchChange}

                renderSuggestion={this.renderSuggestion}
                suggestions={globalPlayersSearch.immutableAvailablePlayers}
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
          </div>
    )
  }
}
