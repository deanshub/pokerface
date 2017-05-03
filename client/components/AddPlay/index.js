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

@inject('feed')
@observer
export default class AddGame extends Component {
  addPhoto(event){
    event.preventDefault()
  }

  addPost(event){
    event.preventDefault()
    this.props.feed.addPost()
  }

  onPostChange(editorState){
    const {feed} = this.props
    feed.updatePost(editorState)
  }

  render() {
    const {feed} = this.props

    return (
      <Form>
        <Grid container>
          <Grid.Row stretched>
            <Grid.Column width={16}>
              <PostEditor
                  editorState={feed.rawEditorState}
                  onChange={::this.onPostChange}
                  placeholder="Share a post"
                  postEditor
              />
            </Grid.Column>

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
            <Grid.Column width={3}>
              <Button
                  content="Insert Card"
                  icon="empty heart"
                  labelPosition="left"
                  onClick={::this.addPhoto}
              />
            </Grid.Column>
            <Grid.Column width={1}/>
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
                  onClick={::this.addPost}
                  primary
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    )
  }
}
