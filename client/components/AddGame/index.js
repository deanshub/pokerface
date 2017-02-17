import React, { Component, PropTypes } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { Grid, Icon, Dropdown, Input, Label, Header, Image, Card, Button } from 'semantic-ui-react'
// import classnames from 'classnames'
// import style from './style.css'
import BuyIns from '../BuyIns'
import Winnings from '../Winnings'

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

export default class AddGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      players: [],
      buyIns: [{value: initialBuyIn, key:Math.random()}],
      winnings: [{value: initialWin, key:Math.random()}],
      endDate: moment(),
      startDate: moment(),
    }
  }

  addBuyIn(){
    const {buyIns} = this.state
    this.setState({
      buyIns: [...buyIns, {value: initialBuyIn, key:Math.random()}],
    })
  }
  removeBuyIn(index){
    const {buyIns} = this.state
    this.setState({
      buyIns: buyIns.slice(0,index).concat(buyIns.slice(index+1)),
    })
  }

  addWin(){
    const {winnings} = this.state
    this.setState({
      winnings: [...winnings, {value: initialWin, key:Math.random()}],
    })
  }
  removeWin(index){
    const {winnings} = this.state
    this.setState({
      winnings: winnings.slice(0,index).concat(winnings.slice(index+1)),
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

  render() {
    const {buyIns, winnings, startDate, endDate} = this.state

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
            {/*dropdown Search Selection*/}
          </Grid.Column>
          <Grid.Column width={3}>
            <Input
                icon="users"
                iconPosition="left"
                placeholder="Add Player..."
                style={{marginBottom:2}}
            />
          </Grid.Column>
          <Grid.Column width={11}>
            <Grid.Row stretched verticalAlign="middle">
              <Label image>
                <img src="/images/dean2.jpg" />
                  Dean
                  <Icon name="delete" />
              </Label>
              <Label image>
                <img src="http://semantic-ui.com/images/avatar/small/zoe.jpg" />
                  Zoe
                  <Icon name="delete" />
              </Label>
              <Label image>
                <img src="http://semantic-ui.com/images/avatar/small/nan.jpg" />
                  Nan
                <Icon name="delete" />
              </Label>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={2}>
            <Card>
              <Image src={'/images/dean2.jpg'}/>
              <Card.Content>
                <Card.Header>
                  Me
                </Card.Header>
                <Card.Content extra>
                  <Icon name="user" />
                  22 Friends
                </Card.Content>
              </Card.Content>
            </Card>
          </Grid.Column>

          <Grid.Column width={14}>
            <BuyIns
                addBuyIn={::this.addBuyIn}
                removeBuyIn={::this.removeBuyIn}
                values={buyIns}
            />
            <Winnings
                addWin={::this.addWin}
                removeWin={::this.removeWin}
                values={winnings}
            />
          </Grid.Column>
        </Grid.Row>
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
