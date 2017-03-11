import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react'
import { Grid, Icon, Card, Image } from 'semantic-ui-react'

import BuyIns from '../BuyIns'
import Winnings from '../Winnings'

@observer
export default class PlayerForm extends Component {
  static propTypes ={
    user: PropTypes.object,
  }

  render() {
    const { user } = this.props

    return (
      <Grid.Row>
        <Grid.Column width={2}>
          <Card>
            <Image src={user.avatar}/>
            <Card.Content>
              <Card.Header>
                {user.fullName}
              </Card.Header>
              <Card.Content extra>
                <Icon name="user" />
                22 Friends
              </Card.Content>
            </Card.Content>
          </Card>
        </Grid.Column>

        <Grid.Column width={14}>
          <BuyIns user={user}/>
          <Winnings user={user}/>
        </Grid.Column>
      </Grid.Row>
    )
  }
}
