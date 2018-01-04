import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import PostEditor from '../PostEditor'
import CardSelection from './CardSelection'
import SpotWizard from '../SpotWizard'
import SpotPlayer from '../../containers/SpotPlayer'
import Button from '../basic/Button'
import DropDown from '../basic/DropDown'
import classnames from 'classnames'
import style from './style.css'

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
  constructor(props){
    super(props)

    this.state = {cardSelectionOpen:false}
    this.postFiles = []
  }

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
    feed.addPost(auth.user, newSpot)
    spotPlayer.newSpot = spotPlayer.initNewPost()
  }

  photosChanged(){
    const {feed} = this.props
    feed.addPreviewUploadMedia(this.photosElm.files)
  }

  deletePhoto(name){
    const {feed} = this.props
    feed.deletePreviewUploadMedia(name)
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
              <SpotPlayer post={spotPlayer.newSpot} style={{height:'40vw', backgroundColor:'white'}}/>
            ):null
          }
          <PostEditor
              placeholder="Share something"
              post={feed.newPost}
              postEditor
          />
           {
             feed.previewUploadedMedia.length>0
             ?
             <div className={classnames(style.imagesContainer)}>
               {
                 feed.previewUploadedMedia.map(({name, type, src})=>{

                   let filePreview
                   if (type.startsWith('video')){
                     filePreview = <video className={classnames(style.image)}>
                       <source src={src} type={type}/>
                    </video>

                   // then image
                   }else{
                     filePreview = <img className={classnames(style.image)} src={src}/>
                   }

                   return <div className={classnames(style.imagePreview)} key={name}>
                     {filePreview}
                     <div className={classnames(style.imagePreviewOverlay)}>
                       <div
                         className={classnames(style.deleteImage)}
                         onClick={() => {this.deletePhoto(name)}}
                       />
                     </div>
                  </div>
                 })
               }
             </div>
             :
             null
           }
          <div className={classnames(style.buttonsPanel)}>
            <div className={classnames(style.editPostButtons)}>
              <div className={classnames(style.insert)}>
                insert
              </div>
              <Button
                  leftIcon="spot"
                  onClick={::this.addSpot}
                  small
              >
                Spot Player
              </Button>
              <DropDown
                  open={cardSelectionOpen}
                  trigger={
                    <Button leftIcon="card" onClick={() => this.setSelect({cardSelectionOpen:true})} small>
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
              <Button leftIcon="emoji" small>
                Emoji
              </Button>
            </div>
            <Button
                disable={!hasText}
                onClick={::this.addPost}
                primary
            >
              Post
            </Button>
          </div>
          <SpotWizard/>
        </div>
      </div>
    )
  }
}
