import React, { Component, PropTypes } from 'react'
import { Grid, Icon, Input, Button, List } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('players')
@observer
export default class BuyIns extends Component {
  static propTypes ={
  }

  render() {
    const {user, players} = this.props
    return (
      <Grid.Row>
        <List horizontal>
          <List.Item>
            <Icon name="money"/>
          </List.Item>
          {user.buyIns.map((buyIn, index)=>
            <List.Item key={buyIn.key}>
              <Input
                  action={<Button icon="remove" onClick={()=>{players.removeBuyIn(user.username, index)}}/>}
                  actionPosition="left"
                  defaultValue={buyIn.value}
                  placeholder="0"
                  size="mini"
                  type="number"
              />
            </List.Item>
          )}
          <List.Item>
            <Button
                icon
                onClick={()=>players.addBuyIn(user.username)}
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
