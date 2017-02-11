import React, { Component, PropTypes } from 'react'
// import classnames from 'classnames'
// import style from './style.css'
// import {Icon} from 'react-fa'
import { Grid, Icon, Dropdown, Input, Label, Header, List, Image, Card, Button } from 'semantic-ui-react'

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

export default class AddGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      players: [],
    }
  }
  render() {
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
        <Grid.Row columns={3}>
          <Grid.Column stretched>
            <Input
                icon="map"
                iconPosition="left"
                placeholder="Location..."
            />
          </Grid.Column>
          <Grid.Column stretched>
            <Input labelPosition="left" type="text" placeholder="Choose Start Date..." defaultValue={new Date()}>
              <Label basic>From</Label>
              <input />
            </Input>
          </Grid.Column>
          <Grid.Column stretched>
            <Input labelPosition="left" type="text" placeholder="Choose End Date..." defaultValue={new Date()}>
              <Label basic>To</Label>
              <input />
            </Input>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched verticalAlign="middle">
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
            <Grid.Row>
              <Icon name="money"/>
              <List horizontal>
                <List.Item>
                  <Input defaultValue={100} type="number"/>
                </List.Item>
                <List.Item>
                  <Label>
                    <Icon name="add" />
                  </Label>
                </List.Item>
              </List>
            </Grid.Row>

            <Grid.Row>
              <Icon name="trophy"/>
              <List horizontal>
                <List.Item>
                  <Input defaultValue={0}/>
                </List.Item>
                <List.Item>
                  <Label>
                    <Icon name="add" />
                  </Label>
                </List.Item>
              </List>
            </Grid.Row>
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
