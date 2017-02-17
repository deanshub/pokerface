import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
// import {Icon} from 'react-fa'
import { Grid, Icon, Input, List, Button } from 'semantic-ui-react'

export default class BuyIns extends Component {
  static propTypes ={
    addWin: PropTypes.func,
    removeWin: PropTypes.func,
    values: PropTypes.array,
  }

  render() {
    const {values, addWin, removeWin} = this.props
    return (
      <Grid.Row>
        <List horizontal>
          <List.Item>
            <Icon name="trophy"/>
          </List.Item>
          {values.map((win, index)=>
            <List.Item key={win.key}>
              <Input
                  action={<Button icon="remove" onClick={()=>{removeWin(index)}}/>}
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
                onClick={addWin}
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
