import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
// import {Icon} from 'react-fa'
import { Grid, Icon, Input, Label, List, Button } from 'semantic-ui-react'

export default class BuyIns extends Component {
  static propTypes ={
    addBuyIn: PropTypes.func,
    removeBuyIn: PropTypes.func,
    values: PropTypes.array,
  }

  render() {
    const {values, addBuyIn, removeBuyIn} = this.props
    return (
      <Grid.Row>
        <List horizontal>
          <List.Item>
            <Icon name="money"/>
          </List.Item>
          {values.map((buyIn, index)=>
            <List.Item key={buyIn.key}>
              <Input
                  action={<Button icon="remove" onClick={()=>{removeBuyIn(index)}}/>}
                  actionPosition="left"
                  defaultValue={buyIn.value}
                  placeholder="0"
                  size="mini"
                  type="number"
              />
            </List.Item>
          )}
          <List.Item>
            <Label className={classnames(style.add)} onClick={addBuyIn}>
              <Icon name="add" />
            </Label>
          </List.Item>
        </List>
      </Grid.Row>
    )
  }
}
