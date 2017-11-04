import React, { Component, PropTypes } from 'react'
import { Grid, Form, Button, Dropdown } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import PostEditor from '../PostEditor'
import CardSelection from './CardSelection'
import SpotWizard from '../SpotWizard'

// const shareWithOptions = [{
//   key: 'everyone',
//   text: 'Everyone',
//   value: 'public',
//   content: 'Everyone',
//   icon: 'world',
// },{
//   key: 'friends',
//   text: 'Friends',
//   value: 'friends',
//   content: 'Friends',
//   icon: 'users',
//   disabled: true,
// },{
//   key: 'private',
//   text: 'Private',
//   value: 'private',
//   content: 'Private',
//   icon: 'user',
//   disabled: true,
// }]

@inject('spotPlayer')
@inject('feed')
@inject('auth')
@observer
export default class AddPlay extends Component {
  addPhoto(event){
    event.preventDefault()
    this.photosElm.click()
  }

  addPost(event){
    event.preventDefault()
    const {feed, auth, spotPlayer} = this.props
    let newSpot
    if(spotPlayer.newSpot.spot.moves.length>0){
      newSpot=spotPlayer.newSpot.spot
    }
    feed.addPost(auth.user, this.photosElm.files, newSpot)
  }

  photosChanged(){
    const {feed} = this.props
    feed.previewUploadImages(this.photosElm.files)
  }

  tagFriends(event){
    event.preventDefault()
    const {feed} = this.props
    feed.addFriendTag()
  }
  insertCard(card){
    const {feed} = this.props
    feed.openCardSelection=false
    feed.addCard(card)
  }

  addSpot(){
    const {spotPlayer} = this.props
    spotPlayer.openSpotEditing()
  }

  render() {
    const {feed} = this.props

    return (
      <Form>
        <Grid container>
          <Grid.Row stretched>
            <Grid.Column width={16}>
              <PostEditor
                  placeholder="Share a post"
                  post={feed.newPost}
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
                  onChange={::this.photosChanged}
                  ref={(photosElm)=>this.photosElm=photosElm}
                  style={{display:'none'}}
                  type="file"
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
                  onClick={::this.tagFriends}
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <Dropdown
                  button
                  className="icon"
                  floating
                  icon="dropdown"
                  labeled
                  onClick={()=>{feed.openCardSelection=!feed.openCardSelection}}
                  open={feed.openCardSelection}
                  text="Insert Card"
              >
                <Dropdown.Menu>
                  <Dropdown.Header content="Select a card" icon="tags" />
                  <Dropdown.Divider />
                  <CardSelection
                      onCardSelected={::this.insertCard}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </Grid.Column>
            <Grid.Column width={3}>
              <Button
                  content="Spot Wizard"
                  icon="wizard"
                  labelPosition="left"
                  onClick={::this.addSpot}
              />
            </Grid.Column>
            <Grid.Column width={1}>
              {/* <Header size="small" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                <Icon name="world" />
                <Header.Content>
                  <Dropdown
                      defaultValue={shareWithOptions[0].value}
                      header="Share with:"
                      inline
                      options={shareWithOptions}
                  />
                </Header.Content>
              </Header> */}
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
        <SpotWizard/>
      </Form>
    )
  }
}
