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

  render(){
    const {players, playerIndex, isDealer, user, handleAvatarClick} = this.props
    const href=`/profile/${user.username}`

    return (
      <div className={classnames(style.playerRow)}>
        <Image
            avatar
            centered
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
              value:user.fullname,
              onChange: ::this.searchInputChange,
            }}
            onSuggestionSelected={::this.onSuggestionSelected}
            onSuggestionsClearRequested={()=>players.searchPlayers.clear()}
            onSuggestionsFetchRequested={::this.searchChange}
            renderInputComponent={(props)=>(
              <Input {...props}/>
            )}
            renderSuggestion={this.renderSuggestion}
            suggestions={players.immutableAvailablePlayers.concat([{guest:true, fullname:user.fullname, username:`guest-${Math.random().toString()}`}])}
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
            onChange={(e,{value})=>user.bank=parseInt(value)}
            placeholder="100"
            type="number"
            value={user.bank}
        />
        <Input
            amount={2}
            cardSelection
            label="Cards"
            onChange={(e,{value})=>user.cards=value}
            rightButton={
              <Button
                  active={user.showCards}
                  leftIcon="show"
                  onClick={()=>user.showCards = !user.showCards}
                  small
                  style={{width: '4.5em', minWidth: 'auto'}}
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
          />
          <Button
              hidden={playerIndex===players.currentPlayers.length-1}
              leftIcon="down"
              onClick={::this.movePlyaerDown}
          />
        </ButtonGroup>
      </div>
    )
  }
}
