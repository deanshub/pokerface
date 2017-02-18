import React, { Component, PropTypes } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { Grid, Icon, Dropdown, Input, Label, Header, Button } from 'semantic-ui-react'
// import classnames from 'classnames'
// import style from './style.css'
import PlayerForm from '../PlayerForm'

const gameTypes = [{
  text: 'Texas Hold\'em',
  value: 'Texas Hold\'em',
},{
  text: 'Omaha High',
  value: 'Omaha High',
},{
  text: 'Omaha Hi\\Lo',
  value: 'Omaha Hi\\Lo',
},{
  text: 'Seven Card Stud',
  value: 'Seven Card Stud',
},{
  text: 'Razz',
  value: 'Razz',
},{
  text: 'Five Card Draw',
  value: 'Five Card Draw',
},{
  text: 'Deuce to Seven Triple Draw',
  value: 'Deuce to Seven Triple Draw',
},{
  text: 'Badugi',
  value: 'Badugi',
},{
  text: 'H.O.R.S.E.',
  value: 'H.O.R.S.E.',
}]

const gameSubTypes = [{
  text: 'Tournement',
  value: 'Tournement',
},{
  text: 'Cash',
  value: 'Cash',
}]

const initialBuyIn=100
const initialWin=0

const wholePlayers = {
  deanshub: {
    image: '/images/dean2.jpg',
    name: 'Dean Shub',
    buyIns: [{value: initialBuyIn, key:Math.random()}],
    winnings: [{value: initialWin, key:Math.random()}],
  },
  zoeD: {
    image: 'http://semantic-ui.com/images/avatar/small/zoe.jpg',
    name: 'Zoe Dechannel',
    buyIns: [{value: initialBuyIn, key:Math.random()}],
    winnings: [{value: initialWin, key:Math.random()}],
  },
  nanWasa: {
    image: 'http://semantic-ui.com/images/avatar/small/nan.jpg',
    name: 'Nan Wasa',
    buyIns: [{value: initialBuyIn, key:Math.random()}],
    winnings: [{value: initialWin, key:Math.random()}],
  },
}

export default class AddGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      players: {
        deanshub: {
          image: '/images/dean2.jpg',
          name: 'Dean Shub',
          buyIns: [{value: initialBuyIn, key:Math.random()}],
          winnings: [{value: initialWin, key:Math.random()}],
        },
      },
      endDate: moment(),
      startDate: moment(),
    }
  }

  addBuyIn(player){
    const {players} = this.state
    const buyIns = players[player].buyIns
    const updatedBuyIns = [...buyIns, {value: initialBuyIn, key:Math.random()}]
    const updatedPlayer = Object.assign({}, players[player], {buyIns:updatedBuyIns})
    const updatedPlayers = Object.assign({}, players, {[player]:updatedPlayer})

    this.setState({
      players: updatedPlayers,
    })
  }
  removeBuyIn(player, index){
    const {players} = this.state
    const buyIns = players[player].buyIns
    const updatedBuyIns = buyIns.slice(0,index).concat(buyIns.slice(index+1))
    const updatedPlayer = Object.assign({}, players[player], {buyIns:updatedBuyIns})
    const updatedPlayers = Object.assign({}, players, {[player]:updatedPlayer})

    this.setState({
      players: updatedPlayers,
    })
  }

  addWin(player){
    const {players} = this.state
    const winnings = players[player].winnings
    const updatedWinnings = [...winnings, {value: initialWin, key:Math.random()}]
    const updatedPlayer = Object.assign({}, players[player], {winnings:updatedWinnings})
    const updatedPlayers = Object.assign({}, players, {[player]:updatedPlayer})

    this.setState({
      players: updatedPlayers,
    })
  }
  removeWin(player, index){
    const {players} = this.state
    const winnings = players[player].winnings
    const updatedWinnings = winnings.slice(0,index).concat(winnings.slice(index+1))
    const updatedPlayer = Object.assign({}, players[player], {winnings:updatedWinnings})
    const updatedPlayers = Object.assign({}, players, {[player]:updatedPlayer})

    this.setState({
      players: updatedPlayers,
    })
  }

  handleChangeStartDate(startDate){
    this.setState({
      startDate,
      endDate: startDate,
    })
  }
  handleChangeEndDate(endDate){
    this.setState({
      endDate,
    })
  }

  removePlayer(player){
    const {players} = this.state
    const {[player]:omit, ...updatedPlayers} = players

    this.setState({
      players: updatedPlayers,
    })
  }

  addPlayer(player){
    const {players} = this.state
    this.setState({
      players: Object.assign({}, players, {[player]: wholePlayers[player]}),
    })
  }

  render() {
    const {startDate, endDate, players} = this.state
    const searchPlayerOptions = Object.keys(wholePlayers).map(player=>{
      return {
        text: wholePlayers[player].name,
        value: player,
        image: wholePlayers[player].image,
        disabled: players[player]!==undefined,
      }
    })

    return (
      <Grid container>
        <Grid.Row columns={2}>
          <Grid.Column textAlign="right">
            <Icon name="game" />
            <Dropdown placeholder="Select Game Type" selection options={gameTypes} />
          </Grid.Column>
          <Grid.Column>
            <Dropdown placeholder="Select Game Sub-Type" selection options={gameSubTypes} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={6} stretched>
            <Input
                icon="map"
                iconPosition="left"
                placeholder="Location..."
            />
          </Grid.Column>
          <Grid.Column width={5} stretched>
            <Input labelPosition="left" type="text" placeholder="Choose Start Date..." defaultValue={new Date()}>
              <Label basic>From</Label>
              <DatePicker
                  endDate={endDate}
                  onChange={::this.handleChangeStartDate}
                  selected={startDate}
                  selectsStart
                  startDate={startDate}
              />
            </Input>
          </Grid.Column>
          <Grid.Column width={5} stretched>
            <Input labelPosition="left" type="text" placeholder="Choose End Date..." defaultValue={new Date()}>
              <Label basic>To</Label>
              <DatePicker
                  endDate={endDate}
                  onChange={::this.handleChangeEndDate}
                  selected={endDate}
                  selectsEnd
                  startDate={startDate}
              />
            </Input>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column width={2}>
            <Header>Players</Header>
          </Grid.Column>
          <Grid.Column width={3}>
            <Dropdown
                fluid
                options={searchPlayerOptions}
                placeholder="Add Player..."
                search
                selection
                style={{marginBottom:2}}
                onChange={(ev, {value})=>this.addPlayer(value)}
            />
          </Grid.Column>
          <Grid.Column width={11}>
            <Grid.Row stretched verticalAlign="middle">
              {Object.keys(players).map(user=>
                <Label image key={user}>
                  <img src={players[user].image} />
                  {players[user].name}
                  <Icon name="delete" onClick={()=>this.removePlayer(user)} />
                </Label>
              )}
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>

        {Object.keys(players).map(user=>
          <PlayerForm
              addBuyIn={()=>this.addBuyIn(user)}
              addWin={()=>this.addWin(user)}
              buyInValues={players[user].buyIns}
              key={user}
              removeBuyIn={(index)=>this.removeBuyIn(user, index)}
              removeWin={(index)=>this.removeWin(user, index)}
              user={players[user]}
              winValues={players[user].winnings}
          />
        )}

        <Grid.Row textAlign="right">
          <Grid.Column>
            <Button
                content="Add The Game"
                icon="add"
                labelPosition="right"
                primary
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
