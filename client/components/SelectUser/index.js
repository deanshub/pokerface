import React, { Component } from 'react'
import {List} from 'semantic-ui-react'
import UserSmallCard from '../../components/UserSmallCard'

export default ({users, onSelectUser}) =>{
  return (
    <List selection>
      {users.map((user) => (
        <List.Item key={user.username} onClick={() => onSelectUser(user.username)}>
          <List.Content>
            <UserSmallCard user={user}/>
          </List.Content>
        </List.Item>
      ))}
    </List>
  )
}
