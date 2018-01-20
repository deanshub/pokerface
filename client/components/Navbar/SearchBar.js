import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Autosuggest from 'react-autosuggest'
import classnames from 'classnames'
import style from './style.css'
import UserSmallCard from '../UserSmallCard'

const SECTION_ORGANIZATIONS = 'Organizations'
const SECTION_PLAYERS = 'Players'
const SECTION_EVENTS = 'Events'

@inject('events')
@inject('globalPlayersSearch')
@inject('routing')
@observer
export default class SearchBar extends Component {
  constructor(props){
    super(props)
    this.state = {searchValue:''}
  }

  getSectionSuggestions(section) {
    // add the section title to all suggestions
    return section.suggestions.map(suggestion => ({...suggestion, section:section.title}))
  }

  searchChange({value}){
    const {events, globalPlayersSearch} = this.props
    globalPlayersSearch.search(value)
    events.search(value)
  }

  renderSectionTitle(section) {
    return (
      <div>{section.title}</div>
    )
  }

  renderSuggestion(item){
    if (item.section === SECTION_EVENTS){
      return (
        <div className={classnames(style.suggestionItem)}>
          <div className={classnames(style.header)}>{item.title}</div>
          <div className={classnames(style.subheader)}>{item.location||' '}</div>
        </div>
      )
    }
    return (
      <UserSmallCard
          className={style.suggestionItem}
          header={item.fullname}
          image={item.avatar}
      />
    )
  }

  onSuggestionSelected(e, {suggestion}){
    const {routing, globalPlayersSearch} = this.props
    globalPlayersSearch.searchValue = ''
    routing.push(`/profile/${suggestion.username}`)
  }

  searchInputChange(e,{newValue}){
    this.setState({searchValue:newValue})
  }

  render(){
    const {events, globalPlayersSearch} = this.props
    const {searchValue} = this.state
    const {immutableAvailablePlayers} = globalPlayersSearch

    const {organizations, players} = immutableAvailablePlayers.reduce(
      ({organizations, players}, user) => {
        if (user.organization){
          organizations.push(user)
        }else{
          players.push(user)
        }

        return {organizations, players}
      },
      {organizations:[], players:[]})

    return (
      <Autosuggest
          getSectionSuggestions={::this.getSectionSuggestions}
          getSuggestionValue={player=>player.fullname}
          highlightFirstSuggestion
          inputProps={{
            placeholder: 'Item',
            value:searchValue,
            onChange: ::this.searchInputChange,
          }}
          multiSection
          onSuggestionSelected={::this.onSuggestionSelected}
          onSuggestionsClearRequested={()=>{
            events.searchEventsResult.clear()
            globalPlayersSearch.availablePlayers.clear()
          }}
          onSuggestionsFetchRequested={::this.searchChange}
          renderSectionTitle={::this.renderSectionTitle}
          renderSuggestion={::this.renderSuggestion}
          suggestions={[
            {title:SECTION_ORGANIZATIONS, suggestions:organizations},
            {title:SECTION_PLAYERS, suggestions:players},
            {title:SECTION_EVENTS, suggestions:events.suggestedEvent},
          ]}
          theme={{
            input: classnames(style.autosuggestInput),
            container: classnames(style.autosuggest),
            sectionContainer: classnames(style.sectionContainer),
            sectionContainerFirst: classnames(style.sectionContainerFirst),
            sectionTitle: classnames(style.sectionTitle),
            suggestionsList: classnames(style.suggestionsList),
            suggestion: classnames(style.suggestion),
            suggestionHighlighted: classnames(style.suggestionHighlighted),
            suggestionFirst: classnames(style.suggestionFirst),
            suggestionsContainer: classnames(style.suggestionsContainer),
            suggestionsContainerOpen: classnames(style.suggestionsContainerOpen),
          }}
      />
    )
  }
}
