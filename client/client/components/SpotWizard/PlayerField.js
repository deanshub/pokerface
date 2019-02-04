import React, { Component } from 'react'
import Button, {ButtonGroup} from '../basic/Button'
import Autosuggest from 'react-autosuggest'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Image from '../basic/Image'
import Input from '../basic/Input'
import classnames from 'classnames'
import style from './style.css'

@inject('players')
@observer
export default class PlayerField extends Component {
  constructor(props){
    super(props)
    this.state = {inputValue:props.user.fullname}
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

  onSuggestionSelected(e, {suggestion}){
    const {players, user, playerIndex} = this.props

    players.setPlayer(playerIndex, {...suggestion, cards: user.cards, bank: user.bank, showCards: user.showCards})
  }

  searchInputChange(e,{newValue, method}){

    if (method !== 'up' && method !== 'down'){
      this.setState({inputValue:newValue})
    }
  }

  removePlayer(){
    const {players, playerIndex, isDealer} = this.props
    // if (isDealer && players.currentPlayers[0]){
    //   settings.dealer = 0
    // }
    players.currentPlayers.splice(playerIndex,1)
  }

  movePlyaerUp(){
    const {players, playerIndex} = this.props
    players.movePlyaerUp(playerIndex)
  }
  movePlyaerDown(){
    const {players, playerIndex} = this.props
    players.movePlyaerDown(playerIndex)
  }

  componentWillReceiveProps(props){
    if (props.user.fullname!==this.state.inputValue){
      this.setState({inputValue:props.user.fullname})
    }
  }

  render(){
    const {players, playerIndex, isDealer, user, handleAvatarClick} = this.props
    const {inputValue} = this.state
    const href=`/profile/${user.username}`

    return (
      <div className={classnames(style.playerRow)}>
        <div className={classnames(style.subPlayerRow)}>
          <Image
              avatar
              href={href}
              onClick={(e)=>{handleAvatarClick(e, href, playerIndex)}}
              src={user.avatar}
              target="_blank"
          />
          <Autosuggest
              getSuggestionValue={player=>player.fullname}
              highlightFirstSuggestion
              id={`${playerIndex}`}
              inputProps={{
                placeholder: 'Player',
                value:inputValue,
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
          <Input
              label="Bank"
              onChange={(e,{value})=>user.bank=parseFloat(value)}
              placeholder="100"
              type="number"
              value={user.bank}
          />
        </div>
        <div className={classnames(style.subPlayerRow)}>
          <Input
              amount={2}
              cardSelection
              label="Cards"
              onChange={(e,{value})=>user.cards=value}
              rightButton={
                <Button
                    active={user.showCards}
                    disable={user.cards===''||!user.cards}
                    leftIcon="show"
                    onClick={()=>user.showCards = !user.showCards}
                    small
                    smallIcon
                    style={{minWidth: '2.5em'}}
                />
              }
              value={user.cards}
          />
          <Button
              active={isDealer}
              leftIcon="dealer"
              onClick={(e)=>{handleAvatarClick(e, href, playerIndex)}}
          />
          <Button
              leftIcon="remove"
              onClick={::this.removePlayer}
          />
          <ButtonGroup>
            <Button
                hidden={playerIndex===0}
                leftIcon="up"
                onClick={::this.movePlyaerUp}
                small
            />
            <Button
                hidden={playerIndex===players.currentPlayers.length-1}
                leftIcon="down"
                onClick={::this.movePlyaerDown}
                small
            />
          </ButtonGroup>
        </div>
      </div>
    )
  }
}