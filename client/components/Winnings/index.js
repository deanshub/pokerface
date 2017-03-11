import React, { Component, PropTypes } from 'react'
import { Grid, Icon, Input, List, Button } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('players')
@observer
export default class Winnings extends Component {
  static propTypes ={
  }

  render() {
    const {user, players} = this.props
    return (
      <Grid.Row>
        <List horizontal>
          <List.Item>
            <Icon name="trophy"/>
          </List.Item>
          {user.winnings.map((win, index)=>
            <List.Item key={win.key}>
              <Input
                  action={<Button icon="remove" onClick={()=>players.removeWin(user.username, index)}/>}
                  actionPosition="left"
                  defaultValue={win.value}
                  placeholder="0"
                  size="mini"
              />
            </List.Item>
          )}
          <List.Item>
            <Button
                icon
                onClick={()=>players.addWin(user.username)}
                size="mini"
            >
              <Icon name="add" />
            </Button>
          </List.Item>
        </List>
      </Grid.Row>
    )
  }
}
