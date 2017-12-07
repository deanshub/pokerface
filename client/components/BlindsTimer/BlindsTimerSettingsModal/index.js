import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Header, Icon, Table, Checkbox, Segment } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import RoundSetting from './RoundSetting'

@inject('timer')
@observer
export default class BlindsTimer extends Component {
  static propTypes ={
    timer: PropTypes.shape(),
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
          mountNode={timer.settingsModalMountNode}
          onClose={::this.closeModal}
          open={timer.settingsModalOpen}
      >
        <Header content="Timer Settings" icon="time"/>
        <Modal.Content>
          <Segment.Group horizontal>
            <Segment>
              <Header size="small">
                Set timer settings,ante,blinds,rounds,breaks...
              </Header>
            </Segment>
            <Segment>
              <Checkbox
                  checked={timer.autoUpdateBlinds}
                  label="Auto update blinds"
                  onChange={()=>timer.autoUpdateBlinds = !timer.autoUpdateBlinds}
              />
            </Segment>
          </Segment.Group>

          <Table
              basic="very"
              celled
              inverted
              selectable
          >
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
                    key={Math.random()}
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
