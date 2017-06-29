// @flow

import React, { Component, PropTypes } from 'react'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'

import moment from 'moment'
import { Grid, Icon, Dropdown, Input, Label, Header, Button } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import PlayerForm from '../PlayerForm'

@inject('players')
@inject('game')
@observer
export default class AddGame extends Component {
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

  searchChange(e: Object, phrase: string){
    const {players} = this.props
    players.search(phrase)
  }

  render() {
    const {game, players} = this.props

    const startDate = game.currentGame.get('startDate')
    const endDate = game.currentGame.get('endDate')

    const searchPlayerOptions = players.searchPlayers.keys().map(username=>{
      const player = players.searchPlayers.get(username)
      return {
        text: player.fullName,
        value: username,
        image: player.avatar,
        disabled: players.currentPlayers.has(username),
      }
    })


    return (
      <Grid container>
        <Grid.Row columns={2}>
          <Grid.Column textAlign="right">
            <Icon name="game" />
            <Dropdown
                options={game.gameTypes}
                placeholder="Select Game Type"
                selection
            />
          </Grid.Column>
          <Grid.Column>
            <Dropdown
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
              {/* <DatePicker
                  endDate={endDate}
                  onChange={(startDate)=>game.handleChangeStartDate(startDate)}
                  selected={startDate}
                  selectsStart
                  startDate={startDate}
              /> */}
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
              {/* <DatePicker
                  endDate={endDate}
                  onChange={(endDate)=>game.handleChangeEndDate(endDate)}
                  selected={endDate}
                  selectsEnd
                  startDate={startDate}
              /> */}
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
                onChange={(ev, {value})=>players.setPlayer(value)}
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
                content="Create a game"
                icon="add"
                labelPosition="right"
                onClick={()=>game.addGame()}
                primary
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
