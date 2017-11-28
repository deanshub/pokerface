import React, { Component, PropTypes } from 'react'
import { Form, Input, Grid, Dropdown, Header, Image } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'

@inject('players')
@inject('auth')
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

  searchChange(e: Object, phrase: string){
    const {players} = this.props
    players.search(phrase)
  }

  selectPlayer(e: Object, player: Object){
    console.log(player);
  }

  componentWillMount(){
    const {auth, players} = this.props
    players.setAuthenticatedUser(auth.user)
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
      // for (let index = players.currentPlayersArray.length+1; index<=newAmount; index++) {
      //   players.addGuest(`Player ${index}`)
      //   players.setPlayer()
      // }

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
        players.setPlayer()
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
                const href=`/profile/${username}`
                const dealerIndex = settings.dealer||0
                return (
                    <Grid.Column
                        key={username}
                        width={5}
                    >
                      <div
                          className={style.playerRow}
                      >
                        <Image
                            className={classnames(style.avatar,{[style.dealerAvatar]:dealerIndex===playerIndex})}
                            href={href}
                            inline
                            onClick={(e)=>{this.handleAvatarClick(e, href, playerIndex)}}
                            shape="circular"
                            size="small"
                            spaced
                            src={user.avatar}
                            target="_blank"
                        />
                        <Header
                            className={style.fullname}
                            size="large"
                        >
                          {user.fullname}
                        </Header>
                        <Form.Field
                            className={style.bank}
                            control={Input}
                            inline
                            label="bank"
                            onChange={(e,{value})=>user.bank=parseInt(value)}
                            placeholder="100"
                            type="number"
                            value={user.bank}
                        />
                        <Form.Field
                            className={style.cards}
                            control={Input}
                            inline
                            label="cards"
                            onChange={(e,{value})=>user.cards=value}
                            placeholder="Ac Ah"
                            value={user.cards}
                        />
                      </div>
                    </Grid.Column>
                )
              })
            }
          </Grid.Row>
        </Grid>
      </Form>
    )
  }
}
