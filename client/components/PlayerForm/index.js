import React, { Component, PropTypes } from 'react'
// import {Icon} from 'react-fa'
import BuyIns from '../BuyIns'
import Winnings from '../Winnings'

import { Grid, Icon, Card, Image } from 'semantic-ui-react'

export default class PlayerForm extends Component {
  static propTypes ={
    addBuyIn: PropTypes.func,
    addWin: PropTypes.func,
    buyInValues: PropTypes.array,
    removeBuyIn: PropTypes.func,
    removeWin: PropTypes.func,
    winValues: PropTypes.array,
    user: PropTypes.object,
  }

  render() {
    const {
      addBuyIn,
      addWin,
      buyInValues,
      winValues,
      user,
      removeBuyIn,
      removeWin,
    } = this.props
    return (
      <Grid.Row>
        <Grid.Column width={2}>
          <Card>
            <Image src={user.image}/>
            <Card.Content>
              <Card.Header>
                {user.name}
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
              addBuyIn={addBuyIn}
              removeBuyIn={removeBuyIn}
              values={buyInValues}
          />
          <Winnings
              addWin={addWin}
              removeWin={removeWin}
              values={winValues}
          />
        </Grid.Column>
      </Grid.Row>
    )
  }
}
