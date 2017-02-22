import React, { Component, PropTypes } from 'react'
import { Grid, Form, TextArea, Button, Icon, Dropdown, Header } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

const shareWithOptions = [{
  key: 'everyone',
  text: 'Everyone',
  value: 'public',
  content: 'Everyone',
  icon: 'world',
},{
  key: 'friends',
  text: 'Friends',
  value: 'friends',
  content: 'Friends',
  icon: 'users',
},{
  key: 'private',
  text: 'Private',
  value: 'private',
  content: 'Private',
  icon: 'user',
}]

// @inject('game')
// @observer
export default class AddGame extends Component {
  addPhoto(event){
    event.preventDefault()
  }

  render() {
    return (
      <Form>
        <Grid container>
          <Grid.Row stretched>
            <Grid.Column>
              <TextArea placeholder="Share a post" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <Grid.Column width={5}>
              <Button
                  content="Photo"
                  icon="add"
                  labelPosition="left"
                  onClick={::this.addPhoto}
              />
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={5}>
              <Header>
                <Icon name="world" />
                <Header.Content>
                  <Dropdown
                      defaultValue={shareWithOptions[0].value}
                      header="Share with:"
                      inline
                      options={shareWithOptions}
                  />
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column width={5}>
              <Button
                  content="Tag friends"
                  icon="users"
                  labelPosition="right"
                  onClick={::this.addPhoto}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    )
  }
}
