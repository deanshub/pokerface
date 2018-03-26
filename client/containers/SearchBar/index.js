import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Autosuggest from 'react-autosuggest'
import classnames from 'classnames'
import style from './style.css'
import UserSmallCard from '../../components/UserSmallCard'
import IsMobile from '../../components/IsMobile'

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
    const {routing, globalPlayersSearch, onItemSelect} = this.props
    globalPlayersSearch.searchValue = ''

    if (suggestion.section === SECTION_EVENTS){
      routing.push(`/events/${suggestion.id}`)
    }else{
      routing.push(`/profile/${suggestion.username}`)
    }

    this.setState({searchValue:''})

    if (onItemSelect){
      onItemSelect()
    }
  }

  searchInputChange(e,{newValue}){
    this.setState({searchValue:newValue})
  }

  storeInputReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input
    }
  };

  componentDidUpdate(prevProps){
    const {autoFocus} = this.props

    if (!prevProps.autoFocus && autoFocus){
      this.input.focus()
    }
  }

  render(){
    const {events, globalPlayersSearch, theme} = this.props
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

    const sections = []
    if (organizations.length > 0){
      sections.push({title:SECTION_ORGANIZATIONS, suggestions:organizations})
    }

    if (players.length > 0){
      sections.push({title:SECTION_PLAYERS, suggestions:players})
    }

    if (events.searchEventsResult.length > 0){
      sections.push({title:SECTION_EVENTS, suggestions:events.suggestedEvent})
    }

    return (
      <IsMobile render={(isMobile) => {
        return (
          <Autosuggest
              focusInputOnSuggestionClick={false}
              getSectionSuggestions={::this.getSectionSuggestions}
              getSuggestionValue={item=>{
                return (item.section === SECTION_EVENTS)?item.title:item.fullname
              }}
              inputProps={{
                placeholder: 'Search',
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
              ref={this.storeInputReference}
              renderSectionTitle={::this.renderSectionTitle}
              renderSuggestion={::this.renderSuggestion}
              suggestions={sections}
              theme={{
                input: classnames(isMobile?style.autosuggestInputMobile:style.autosuggestInput, style[theme]),
                container: classnames(isMobile?style.autosuggestMobile:style.autosuggest),
                sectionContainer: classnames(style.sectionContainer),
                sectionContainerFirst: classnames(style.sectionContainerFirst),
                sectionTitle: classnames(style.sectionTitle),
                suggestionsList: classnames(style.suggestionsList),
                suggestion: classnames(style.suggestion),
                suggestionHighlighted: classnames(style.suggestionHighlighted),
                suggestionFirst: classnames(style.suggestionFirst),
                suggestionsContainer: classnames(isMobile?style.suggestionsContainerMobile:style.suggestionsContainer),
                suggestionsContainerOpen: classnames(style.suggestionsContainerOpen),
              }}
          />
        )
      }}
      />
    )
  }
}
