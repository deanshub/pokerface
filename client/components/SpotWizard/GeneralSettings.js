import React, { Component, PropTypes } from 'react'
import { Form, Input, Grid, Dropdown, Header, Image, Checkbox } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import PlayerField from './PlayerField'
import classnames from 'classnames'
import style from './style.css'

@inject('players')
@observer
export default class GeneralSettings extends Component {
  renderLabel(label: Object){
    return {
      key: label.value,
      image:label.image,
      content:label.text,
      className: classnames(style.playerLabel),
    }
  }

  searchChange(e: Object, data: string){
    const {players} = this.props
    const phrase = data.searchQuery
    players.search(phrase)
  }

  selectPlayer(e: Object, player: Object){
    console.log(player);
  }

  handleAvatarClick(e, href, playerIndex){
    const {settings} = this.props
    e.preventDefault()
    console.log(href);
    settings.dealer = playerIndex
  }

  playersAmountChange(e, {value}){
    const {players} = this.props
    const newAmount = parseInt(value)
    if (players.currentPlayersArray.length<newAmount){

      const amountOfPlayerToAdd = newAmount - players.currentPlayersArray.length
      const anonymosPlayers = players.currentPlayers.values().filter((player)=>/^Player (\d)+$/.test(player.fullname))
      const lastIndex = anonymosPlayers.reduce((res,player)=>{
        const curNumber = parseInt(player.fullname.substring('Player '.length))
        if (res>curNumber){
          return res
        }else {
          return curNumber
        }
      },0)
      for (let index = 0; index<amountOfPlayerToAdd; index++) {
        players.addGuest(`Player ${lastIndex + index+1}`)
      }
    }else if(players.currentPlayersArray.length>newAmount && newAmount>0){
      const amountOfPlayerToDelete = players.currentPlayersArray.length-newAmount

      for (let index = 0; index<amountOfPlayerToDelete; index++) {
        const key = players.currentPlayersArray[players.currentPlayersArray.length-1]
        players.currentPlayers.delete(key)
      }
    }
  }

  smallBlindChange(e, {value}){
    const {settings} = this.props
    const sb = parseInt(value)||0
    settings.sb = sb
    settings.bb = 2*sb
  }

  anteChange(e, {value}){
    const {settings} = this.props
    const ante = parseInt(value)||0
    settings.ante = ante
    settings.sb = ante
    settings.bb = 2*settings.sb
  }

  render(){
    const {players, settings} = this.props
    const searchPlayerOptions = players.searchPlayers.keys().map(username=>{
      const player = players.searchPlayers.get(username)
      return {
        text: player.fullname,
        value: username,
        image: player.avatar,
        disabled: players.currentPlayers.has(username),
      }
    })
    // currency (Dropdown)
    // players [username\guest name, bank, cards]
    // bb, sb
    // dealer

    return (
      <Form className={classnames(style.formContainer)}>
        <Form.Group widths="equal">
          <Form.Field
              control={Input}
              id="form-input-control-first-name"
              label="Currency"
              onChange={(e,{value})=>settings.currency=value}
              placeholder="$"
              value={settings.currency}
          />
          <Form.Field
              control={Input}
              id="form-input-control-last-name"
              label="Ante"
              onChange={::this.anteChange}
              placeholder="0"
              type="number"
              value={settings.ante}
          />
          <Form.Field
              control={Input}
              id="form-input-control-last-name"
              label="Small Blind"
              onChange={::this.smallBlindChange}
              placeholder="1"
              type="number"
              value={settings.sb}
          />
          <Form.Field
              control={Input}
              id="form-input-control-last-name"
              label="Big Blind"
              onChange={(e,{value})=>settings.bb=parseInt(value)||0}
              placeholder="2"
              type="number"
              value={settings.bb}
          />
        </Form.Group>
        <Grid className={classnames(style.gridCointainer)}>
          <Grid.Row stretched>
            <Grid.Column width={1}>
              <Input
                  error={players.currentPlayersArray.length>9}
                  fluid
                  onChange={::this.playersAmountChange}
                  onClick={(e)=>e.target.select()}
                  type="number"
                  value={players.currentPlayersArray.length}
              />
            </Grid.Column>
            <Grid.Column
                textAlign="center"
                verticalAlign="middle"
                width={1}
            >
              <Header>Players</Header>
            </Grid.Column>
            <Grid.Column width={14}>
              <Dropdown
                  additionPosition="bottom"
                  allowAdditions
                  error={players.currentPlayersArray.length>9}
                  fluid
                  multiple
                  noResultsMessage="No players found"
                  onAddItem={(ev,data)=>{players.addGuest(data.value)}}
                  onChange={(ev, data)=>{players.setPlayer(data.value)}}
                  onLabelClick={this.selectPlayer}
                  onSearchChange={::this.searchChange}
                  options={searchPlayerOptions}
                  placeholder="Add Player..."
                  renderLabel={this.renderLabel}
                  search
                  selectOnBlur={false}
                  selection
                  style={{marginBottom:2}}
                  value={players.currentPlayersArray}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className={classnames(style.playersRow)} stretched>
            {
              // [username\guest name, bank, cards]
              players.currentPlayers.keys().map((username, playerIndex)=>{
                const user=players.currentPlayers.get(username)
                const dealerIndex = settings.dealer||0
                return (
                  <PlayerField
                      handleAvatarClick={::this.handleAvatarClick}
                      isDealer={dealerIndex===playerIndex}
                      key={username}
                      playerIndex={playerIndex}
                      user={user}
                  />
                )
              })
            }
          </Grid.Row>
        </Grid>
      </Form>
    )
  }
}
