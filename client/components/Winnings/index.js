import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import Button from '../basic/Button'
import Input from '../basic/Input'
import { observer, inject } from 'mobx-react'

@inject('players')
@observer
export default class Winnings extends Component {
  static propTypes ={
  }

  render() {
    const {user, players} = this.props
    return (
      <div>
        <div>
          <div>
            {/* <Icon name="trophy"/> */}
          </div>
          {user.winnings.map((win)=>
            <div key={win.key}>
              <Input
                  // action={<Button icon="remove" onClick={()=>players.removeWin(user.username, index)}/>}
                  actionPosition="left"
                  defaultValue={win.value}
                  placeholder="0"
                  size="mini"
              />
            </div>
          )}
          <div>
            <Button
                icon
                onClick={()=>players.addWin(user.username)}
                size="mini"
            >
              add
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
