import React, { Component, PropTypes } from 'react'
import { Table, Label, Input, Button, Icon, Header } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('timer')
@observer
export default class BlindsTimer extends Component {
  static propTypes ={
    roundIndex: PropTypes.number.isRequired,
    round: PropTypes.object.isRequired,
  }

  handleChange(ev, val){
    console.log(ev,val);
  }

  render() {
    const {timer, round, roundIndex} = this.props

    return round.type==='break'?
      <Table.Row positive>
        <Table.Cell/>
        <Table.Cell textAlign="center">
          <Header>
            {`${round.time} Minutes Break`}
          </Header>
        </Table.Cell>
        <Table.Cell/>
        <Table.Cell/>
        <Table.Cell/>
        <Table.Cell>
          <Button icon onClick={()=>timer.removeRound(roundIndex)}>
            <Icon name="remove" />
          </Button>
        </Table.Cell>
      </Table.Row>
      :
      <Table.Row>
        <Table.Cell textAlign="center">
          <Label circular>{roundIndex+1}</Label>
        </Table.Cell>
        <Table.Cell>
          <Input
              defaultValue={round.smallBlind}
              onChange={(ev,{value})=>round.smallBlind=value}
              type="number"
          />
        </Table.Cell>
        <Table.Cell>
          <Input
              defaultValue={round.bigBlind}
              onChange={(ev,{value})=>round.bigBlind=value}
              type="number"
          />
        </Table.Cell>
        <Table.Cell>
          <Input
              defaultValue={round.ante}
              onChange={(ev,{value})=>round.ante=value}
              type="number"
          />
        </Table.Cell>
        <Table.Cell>
          <Input
              defaultValue={round.time}
              onChange={(ev,{value})=>round.time=value}
              type="number"
          />
        </Table.Cell>
        <Table.Cell>
          <Button icon onClick={()=>timer.removeRound(roundIndex)}>
            <Icon name="remove" />
          </Button>
        </Table.Cell>
      </Table.Row>
  }
}
