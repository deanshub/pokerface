import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Autosuggest from 'react-autosuggest'
import classnames from 'classnames'
import style from './style.css'

@inject('events')
@inject('feed')
@observer
export default class EventBlock extends Component {
  constructor(props){
    super(props)
    this.state = {searchValue:''}
  }

  componentDidMount(){
    const {events, feed} = this.props
    const {currentEventDetails} = events

    feed.newPost.event = currentEventDetails
    this.setState({searchValue:currentEventDetails?currentEventDetails.title:''})
  }

  componentWillReceiveProps(nextProps){
    const {newPost:nextNewPost} = nextProps.feed

    if (!nextNewPost.event){
      this.setState({searchValue:''})
    }
  }

  searchChange({value}){
    const {events} = this.props
    events.search(value)
  }

  searchInputChange(e,{newValue, method}){
    const {events} = this.props

    if (method==='type'){
      events.search(newValue)
    }

    this.setState({searchValue:newValue})
  }

  onSuggestionSelected(e, {suggestion}){
    const {feed} = this.props
    feed.newPost.event = suggestion
  }

  renderSuggestion(event){
    return (
      <div className={classnames(style.suggestionItem)}>
        <div className={classnames(style.header)}>{event.title}</div>
        <div className={classnames(style.subheader)}>{event.location||' '}</div>
      </div>
    )
  }

  reomveEvent(){
    const {feed} = this.props
    feed.newPost.event = undefined
    this.setState({searchValue:''})
  }

  onSearchInputBlur(){
    const {searchValue} = this.state
    const {newPost} = this.props.feed

    if (newPost.event){
      // like remove
      if (searchValue === ''){
        newPost.event = undefined
      // return the event
      } else if (newPost.event.title !== searchValue){
        this.setState({searchValue:newPost.event.title})
      }
    }
  }

  render(){
    const {events, feed} = this.props
    const {searchValue} = this.state
    const permenentEvent = !!events.currentEventDetails
    const remove = !!feed.newPost.event && !permenentEvent
    console.log("render", feed.newPost.event );
    return(
      <div className={classnames(style.eventPanel)}>
        <div className={classnames(style.label)}>
          event
        </div>
        <Autosuggest
            getSuggestionValue={event=>event.title}
            inputProps={{
              placeholder: 'Search Event...',
              value:searchValue,
              onChange: ::this.searchInputChange,
              onBlur: ::this.onSearchInputBlur,
            }}
            onSuggestionSelected={::this.onSuggestionSelected}
            onSuggestionsClearRequested={()=>{
              events.searchEventsResult.clear()
            }}
            onSuggestionsFetchRequested={::this.searchChange}
            renderInputComponent={(props)=>(
              <input {...props} disabled={permenentEvent}/>
            )}
            renderSuggestion={this.renderSuggestion}
            suggestions={events.suggestedEvent}

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
        {
          remove &&
            <div className={classnames(style.removeEvent)} onClick={::this.reomveEvent}>
            remove
          </div>
        }
      </div>
    )
  }
}
