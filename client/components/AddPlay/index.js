import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import PostEditor from '../PostEditor'
import CardSelection from './CardSelection'
import MediaPreview from './MediaPreview'
import SpotWizard from '../SpotWizard'
import SpotPlayer from '../../containers/SpotPlayer'
import Button from '../basic/Button'
import DropDown from '../basic/DropDown'
import classnames from 'classnames'
import style from './style.css'
import EventBlock from './EventBlock'
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
@inject('events')
@observer
export default class AddPlay extends Component {
  constructor(props){
    super(props)

    this.state = {cardSelectionOpen:false}
  }

  addPhoto(event){
    event.preventDefault()
    this.photosElm.click()
  }

  addPost(event){
    event.preventDefault()
    const {feed, auth, spotPlayer, events:eventsStore} = this.props
    let newSpot
    if(spotPlayer.newSpot.spot.moves.length>0){
      newSpot=spotPlayer.newSpot.spot
    }
    feed.addPost(auth.user, newSpot, eventsStore.currentEventDetails)
    spotPlayer.newSpot = spotPlayer.initNewPost()
  }

  photosChanged(){
    const {feed} = this.props
    feed.addPreviewUploadMedia(this.photosElm.files)
  }

  deleteSoptPlayer(){
    const {spotPlayer} = this.props
    spotPlayer.newSpot = spotPlayer.initNewPost()
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
    const {feed, spotPlayer} = this.props
    const {cardSelectionOpen} = this.state
    const hasSpot = spotPlayer.newSpot.spot.moves.length>0
    const hasText = feed.newPost.content.getCurrentContent().hasText()

    return (
      <div>
        <div className={classnames(style.info)}>
          @ - tag friends  [] - insert cards  : - insert emoji
        </div>
        <div className={classnames(style.addPostContent)}>
          {
            hasSpot?(
              <div className={classnames(style.spotWPreview)}>
                <SpotPlayer post={spotPlayer.newSpot} style={{height:'40vw', backgroundColor:'white'}}/>
                <div className={classnames(style.spotPreviewOverlay)}>
                  <div
                    className={classnames(style.deleteImage)}
                    onClick={::this.deleteSoptPlayer}
                  />
                </div>
              </div>
            ):null
          }
          <PostEditor
              placeholder="Share something"
              post={feed.newPost}
              postEditor
          />

          <MediaPreview/>
          <EventBlock/>
          <div className={classnames(style.buttonsPanel)}>
            <div className={classnames(style.label)}>
              insert
            </div>
            <div className={classnames(style.editPostButtons)}>
              <div className={classnames(style.actionButtons)}>
                <Button
                    leftIcon="spot"
                    onClick={::this.addSpot}
                    small
                >
                  Spot Wizard
                </Button>
                <DropDown
                    open={cardSelectionOpen}
                    trigger={
                      <Button leftIcon="card" onClick={() => this.setSelect({cardSelectionOpen:true})}>
                        Card
                      </Button>
                    }
                >
                  <CardSelection
                      amount={1}
                      onCardSelected={::this.insertCard}
                  />
                </DropDown>

                <input
                    multiple
                    onChange={::this.photosChanged}
                    ref={(photosElm)=>this.photosElm=photosElm}
                    style={{display:'none'}}
                    type="file"
                />
                <Button
                    leftIcon="photo"
                    onClick={::this.addPhoto}
                    small
                >
                  Photo/Video
                </Button>
                {/* {<Button leftIcon="emoji" small>
                  Emoji
                </Button>} */}
              </div>
              <Button
                  disable={!hasText}
                  onClick={::this.addPost}
                  primary
              >
                Post
              </Button>
            </div>
          </div>
          <SpotWizard/>
        </div>
      </div>
    )
  }
}
