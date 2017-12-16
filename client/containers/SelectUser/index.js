// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import {List} from 'semantic-ui-react'
import UserSmallCard from '../../components/UserSmallCard'

@inject('auth')
@observer
export default class SelectUser extends Component {

  render(){
    const {auth:{user}, onSelectUser} = this.props
    return (
      <List selection>
        <List.Item key={user.id} onClick={() => onSelectUser(user.id)}>
          <UserSmallCard user={user}/>
        </List.Item>
        {user.organizations && user.organizations.map((org) => (
          <List.Item key={org.id} onClick={() => onSelectUser(org.id)}>
            <List.Content>
              <UserSmallCard user={org}/>
            </List.Content>
          </List.Item>
        ))}
      </List>
    )
  }
}
