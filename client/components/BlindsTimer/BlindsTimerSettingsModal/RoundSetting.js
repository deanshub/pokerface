import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Label, Input, Button, Icon, Header } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('timer')
@observer
export default class BlindsTimer extends Component {
  static propTypes ={
    roundIndex: PropTypes.number.isRequired,
    round: PropTypes.object.isRequired,
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
              min={0}
              onChange={(ev,{value})=>timer.updateRound(round, 'smallBlind', parseInt(value))}
              type="number"
              value={round.smallBlind}
          />
        </Table.Cell>
        <Table.Cell>
          <Input
              min={0}
              onChange={(ev,{value})=>timer.updateRound(round, 'bigBlind', parseInt(value))}
              type="number"
              value={round.bigBlind}
          />
        </Table.Cell>
        <Table.Cell>
          <Input
              min={0}
              onChange={(ev,{value})=>timer.updateRound(round, 'ante', parseInt(value))}
              type="number"
              value={round.ante}
          />
        </Table.Cell>
        <Table.Cell>
          <Input
              min={0}
              onChange={(ev,{value})=>timer.updateRound(round, 'time', parseInt(value))}
              type="number"
              value={round.time}
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
