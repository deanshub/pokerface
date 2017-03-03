import React, { Component, PropTypes } from 'react'
import { Modal, Button, Header, Icon, Table } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import RoundSetting from './RoundSetting'

@inject('timer')
@observer
export default class BlindsTimer extends Component {
  static propTypes ={
  }

  closeModal(){
    const {timer} = this.props
    timer.settingsModalOpen = false
  }

  addRound(){
    const {timer} = this.props
    timer.addRound()
  }
  addBreak(){
    const {timer} = this.props
    timer.addBreak()
  }

  render() {
    const {timer} = this.props

    return (
      <Modal
          basic
          onClose={::this.closeModal}
          open={timer.settingsModalOpen}
      >
        <Header content="Timer Settings" icon="time"/>
        <Modal.Content>
          <p>Set timer settings,ante,blinds,rounds,breaks...</p>
          <Table basic="very" celled selectable inverted>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  Round Number
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Small Blind
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Big Blind
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Ante
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Duration
                </Table.HeaderCell>
                <Table.HeaderCell/>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {timer.rounds.map((round, roundIndex)=>
                <RoundSetting
                    key={round.key}
                    round={round}
                    roundIndex={roundIndex}
                />)
              }
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button
              basic
              inverted
              onClick={::this.addRound}
          >
            <Icon name="add" /> Add Round
          </Button>
          <Button
              basic
              inverted
              onClick={::this.addBreak}
          >
            <Icon name="add" /> Add Break
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
