import React, { Component, PropTypes } from 'react'
import { Grid, Form, Button, Icon, Dropdown, Header } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import PostEditor from '../PostEditor'

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
              <PostEditor/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <Grid.Column width={3}>
              <Button
                  content="Add Photos"
                  icon="add"
                  labelPosition="left"
                  onClick={::this.addPhoto}
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <Button
                  content="Tag friends"
                  icon="users"
                  labelPosition="left"
                  onClick={::this.addPhoto}
              />
            </Grid.Column>
            <Grid.Column width={4}/>
            <Grid.Column width={3}>
              <Header size="small" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
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
            <Grid.Column width={3}>
              <Button
                  content="Post"
                  icon="share alternate"
                  labelPosition="left"
                  onClick={::this.addPhoto}
                  primary
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    )
  }
}
