// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'

import moment from 'moment'
import { Grid, Icon, Dropdown, Input, Label, Header, Button, Form, TextArea } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
// import PlayerForm from '../PlayerForm'

@inject('players')
@inject('game')
@inject('routing')
@inject('events')
@inject('auth')
@observer
export default class AddGame extends Component {
  static propTypes = {
    handleClose: PropTypes.func.isRequired,
  }

  constructor(props: Object){
    super(props)
    this.state = {
      endDate: moment(),
      startDate: moment(),
    }
  }

  renderLabel(label: Object){
    return {
      key: label.value,
      image:label.image,
      content:label.text,
      className: classnames(style.playerLabel),
    }
  }

  scrollToPlayer(e: Object, player: Object){
    console.log(player);
  }

  searchChange(e: Object, data: string){
    const {players} = this.props
    const phrase = data.searchQuery
    players.search(phrase)
  }

  addGame(e: Object){
    e.preventDefault()
    const { game, events, routing, handleClose, players} = this.props
    events.createGame(players.currentPlayers, game.currentGame)
    .then(res=>{
      if (!res.err){
        game.resetGame()
        routing.push('/events')
        handleClose()
      }
    })
  }

  componentWillMount(){
    const {auth, players} = this.props
    players.setAuthenticatedUser(auth.user)
  }

  render() {
    const {game, players} = this.props

    const startDate = game.currentGame.get('startDate')
    const endDate = game.currentGame.get('endDate')

    const searchPlayerOptions = players.searchPlayers.keys().map(username=>{
      const player = players.searchPlayers.get(username)
      return {
        text: player.fullname,
        value: username,
        image: player.avatar,
        disabled: players.currentPlayers.includes(username),
      }
    })

    return (
      <Form>
      <Grid container>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Form.Field
                control={Input}
                id="form-input-control-title"
                label="Game Title"
                onChange={(ev, a)=>game.titleChangeHandler(a.value)}
                placeholder="Game Title"
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={1}>
          <Grid.Column>
            <Form.Field
                autoHeight
                control={TextArea}
                id="form-textarea-control-description"
                label="Game Description"
                onChange={(ev, a)=>game.descriptionChangeHandler(a.value)}
                placeholder="Game Description"
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column textAlign="right">
            <Icon name="game" />
            <Dropdown
                onChange={(ev, a)=>game.typeChangeHandler(a.value)}
                options={game.gameTypes}
                placeholder="Select Game Type"
                selection
            />
          </Grid.Column>
          <Grid.Column>
            <Dropdown
                onChange={(ev, a)=>game.subTypeChangeHandler(a.value)}
                options={game.gameSubTypes}
                placeholder="Select Game Sub-Type"
                selection
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column stretched width={6}>
            <Input
                icon="map"
                iconPosition="left"
                onChange={(ev, a)=>game.locationChangeHandler(a.value)}
                placeholder="Location..."
            />
          </Grid.Column>
          <Grid.Column stretched width={5}>
            <Input
                defaultValue={new Date()}
                labelPosition="left"
                placeholder="Choose Start Date..."
                type="text"
            >
              <Label basic>From</Label>
              <Datetime
                  onChange={(startDate)=>game.handleChangeStartDate(startDate)}
                  value={startDate}
              />
            </Input>
          </Grid.Column>
          <Grid.Column stretched width={5}>
            <Input
                defaultValue={new Date()}
                labelPosition="left"
                placeholder="Choose End Date..."
                type="text"
            >
              <Label basic>To</Label>
              <Datetime
                  onChange={(endDate)=>game.handleChangeEndDate(endDate)}
                  value={endDate}
              />
            </Input>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column width={2}>
            <Header>Players</Header>
          </Grid.Column>
          <Grid.Column width={14}>
            <Dropdown
                additionPosition="bottom"
                allowAdditions
                fluid
                multiple
                noResultsMessage="No players found"
                onAddItem={(ev,data)=>{players.addGuest(data.value)}}
                onChange={(ev, data)=>{players.setPlayer(data.value)}}
                onLabelClick={this.scrollToPlayer}
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

        {/**players.currentPlayers.keys().map(user=>
          <PlayerForm key={user} user={players.currentPlayers.get(user)} />
        )**/}

        <Grid.Row textAlign="right">
          <Grid.Column>
            <Button
                content="Create game"
                icon="add"
                labelPosition="right"
                onClick={::this.addGame}
                primary
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      </Form>
    )
  }
}
