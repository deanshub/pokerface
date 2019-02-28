import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Autosuggest from 'react-autosuggest'
import Image from '../../components/basic/Image'
import classnames from 'classnames'
import style from './cashCalculator.css'
import Input from '../../components/basic/Input'
import Button from '../../components/basic/Button'

@inject('players')
@observer
class PlayerField extends Component {
  constructor(props){
    super(props)
    this.state = {inputValue: props.user.fullname}
  }

  searchInputChange(e,{newValue, method}){
    if (method !== 'up' && method !== 'down'){
      this.setState({inputValue:newValue})
    }
  }

  onSuggestionSelected(e, {suggestion}){
    const {players, user, playerIndex} = this.props
    players.setPlayer(playerIndex, {...suggestion})
  }

  searchChange({value}){
    const {players} = this.props
    players.search(value)
  }

  renderSuggestion(player,{query}){
    if (!player.guest){
      return(
        <div className={classnames(style.suggestionItem)}>
          <Image
              avatar
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

  removePlayer(){
    const {players, playerIndex} = this.props
    players.currentPlayers.splice(playerIndex,1)
  }

  render() {
    const {players, changePlayer, playerIndex, user} = this.props
    const {inputValue} = this.state

    return (
      <div className={classnames(style.playerField)}>
        <Image
            avatar
            src={user.avatar}
        />
        <Autosuggest
            getSuggestionValue={player=>player.fullname}
            highlightFirstSuggestion
            id={`${playerIndex}`}
            inputProps={{
              placeholder: 'Player',
              value: inputValue,
              onChange: ::this.searchInputChange,
            }}
            onSuggestionSelected={::this.onSuggestionSelected}
            onSuggestionsClearRequested={()=>players.searchPlayers.clear()}
            onSuggestionsFetchRequested={::this.searchChange}
            renderInputComponent={(props)=>(
              <Input containerStyle={{margin:'0'}} {...props}/>
            )}
            renderSuggestion={this.renderSuggestion}
            suggestions={players.immutableAvailablePlayers.concat([{guest:true, fullname:inputValue, username:`guest-${Math.random().toString()}`}])}
            theme={{
              container: classnames(style.autosuggest),
              suggestionsList: classnames(style.suggestionsList),
              suggestion: classnames(style.suggestion),
              suggestionHighlighted: classnames(style.suggestionHighlighted),
              suggestionsContainer: classnames(style.suggestionsContainer),
              suggestionsContainerOpen: classnames(style.suggestionsContainerOpen),
            }}
        />
        <Button
            leftIcon="remove"
            onClick={::this.removePlayer}
        />
      </div>
    )
  }
}

export default PlayerField
