import React, { Component, PropTypes } from 'react'
import { Grid, Form, Button, Icon, Dropdown, Header, Input } from 'semantic-ui-react'
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
    this.photosElm.click()
  }

  addPost(event){
    event.preventDefault()
    this.props.feed.addPost(this.photosElm.files)
  }

  onPostChange(editorState){
    const {feed} = this.props
    feed.updatePost(editorState)
  }

  photosChanged(){
    const {feed} = this.props
    feed.previewUploadImages(this.photosElm.files)
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
            {
              feed.uploadImages.length>0
              ?
              <Grid.Column style={{marginTop:-27, marginBottom:27, display:'flex !important', flexDirection:'row', flexFlow:'row wrap'}} width={16}>
                {
                  feed.uploadImages.map(src=>(
                    <img
                        key={Math.random()}
                        src={src}
                        style={{width:'6em', height:'3em', flexGrow:0}}
                    />
                  ))
                }
              </Grid.Column>
              :
              null
            }

            <Grid.Column width={3}>
              <input
                  multiple
                  ref={(photosElm)=>this.photosElm=photosElm}
                  style={{display:'none'}}
                  type="file"
                  onChange={::this.photosChanged}
              />
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
                  type="file"
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
