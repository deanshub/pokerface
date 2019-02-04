import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import CardSelectionTooltip from '../../components/CardSelection/CardSelectionTooltip'
import Button from '../../components/basic/Button'
import Tooltip from '../../components/basic/Tooltip'
import IsMobile from '../../components/IsMobile'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'

@inject('spotPlayer')
@inject('feed')
@inject('auth')
@inject('events')

@observer
export default class ButtonsPanel extends Component {
  constructor(props){
    super(props)
    this.state = {
      cardSelectionOpen: false,
    }
  }
  addSpot(){
    const {auth,spotPlayer} = this.props
    spotPlayer.openSpotEditing(auth.user)
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
  addPhoto(event){
    event.preventDefault()
    this.photosElm.click()
  }
  photosChanged(){
    const {feed} = this.props
    feed.addPreviewUploadMedia(this.photosElm.files)
  }
  tagFriends(event){
    event.preventDefault()
    const {feed} = this.props
    feed.addFriendTag()
  }
  insertCard(card){
    const {feed} = this.props
    feed.addCard(card)
  }

  render(){
    const {feed} = this.props
    const {cardSelectionOpen} = this.state
    const hasText = feed.newPost.content.getCurrentContent().hasText()

    const ActionButtons = () => {
      return (
        <IsMobile render={(isMobile) => {
          return (
            <div className={classnames(style.actionButtons)}>
              <Button
                  leftIcon="spot"
                  onClick={::this.addSpot}
                  small
              >
                {!isMobile?'Spot Wizard':''}
              </Button>
              <CardSelectionTooltip
                  amount={1}
                  onCardSelected={::this.insertCard}
                  trigger={
                    <Button leftIcon="card">
                      {!isMobile?'Card':''}
                    </Button>
                  }
              />
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
                {!isMobile?'Photo/Video':''}
              </Button>
              {/* {<Button leftIcon="emoji" small>
                {!isMobile && 'Emoji'}
              </Button>} */}
            </div>
          )
        }}
        />
      )
    }

    return (
      <div className={classnames(style.buttonsPanel)}>
        <div className={classnames(style.label)}>
          insert
        </div>
        <div className={classnames(style.editPostButtons)}>
          <ActionButtons/>
          <Button
              disable={!hasText}
              onClick={::this.addPost}
              primary
          >
            Post
          </Button>
        </div>
      </div>
    )
  }
}
