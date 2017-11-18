// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Feed, Icon, Button, Popup, Dropdown, Dimmer, Segment, Loader } from 'semantic-ui-react'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'
import ReactDOM from 'react-dom'
import domtoimage from 'dom-to-image'
import GIF from 'gif.js.optimized'
import workerScript from 'file-loader!gif.js.optimized/dist/gif.worker'

import Comments from './Comments'
import Reply from './Reply'
import PostImage from './PostImage'
import PostEditor from '../../components/PostEditor'
import classnames from 'classnames'
import style from './style.css'
import logger from '../../utils/logger'

TimeAgo.locale(timeAgoEnLocale)

@inject('photoGallery')
@inject('routing')
@inject('auth')
@inject('feed')
@inject('spotPlayer')
@observer
export default class Post extends Component {
  static propTypes = {
    auth: PropTypes.shape(),
    post: PropTypes.shape(),
    standalone: PropTypes.bool,
  }

  constructor(props){
    super(props)
    this.timeAgo = new TimeAgo('en-US')
    this.state = {
      busy: false,
    }
  }

  goto(event){
    const {post, routing, auth} = this.props
    event.preventDefault()
    if (post.player.username===auth.user.username){
      routing.push('/profile')
    }else{
      routing.push(`/profile/${post.player.username}`)
    }
  }

  getUserFullName(){
    const { post, auth } = this.props
    return post.player.username===auth.user.username?'You':post.player.fullname
  }
  getUserImageUrl(){
    const { post } = this.props
    return post.player.avatar
  }

  openDeletePopup(){
    const { post }= this.props
    post.deletePopupOpen = true
  }
  closeDeletePopup(){
    const { post }= this.props
    post.deletePopupOpen = false
  }

  deletePost(){
    const { post, feed }= this.props
    feed.deletePost(post.id)
    this.closeDeletePopup()
  }

  getFeedSummary(){
    const { post, auth, standalone } = this.props
    const deleteButton = (
      <Popup
          content={
            <div>
              Are you sure?
              <Button.Group compact style={{marginLeft:10}}>
                <Button
                    basic
                    color="green"
                    onClick={::this.deletePost}
                >
                  Yes
                </Button>
                <Button
                    basic
                    color="red"
                    onClick={::this.closeDeletePopup}
                >
                  No
                </Button>
              </Button.Group>
            </div>
          }
          on="click"
          onClose={::this.closeDeletePopup}
          onOpen={::this.openDeletePopup}
          open={post.deletePopupOpen}
          trigger={
            <Button
                basic
                compact
                floated="right"
                icon="delete"
                size="small"
            />
          }
      />
    )


    let titleComponents = [(
      <Feed.User
          href={`/profile/${post.player.username}`}
          key="1"
          onClick={::this.goto}
      >
        {this.getUserFullName()}
      </Feed.User>
    )]
    if (post.spot!==undefined) {
      titleComponents.push(' shared a game spot')
    }else if (post.photos.length>0) {
      titleComponents.push(' added ')
      titleComponents.push(<a key="2" onClick={()=>this.openModal()}>{post.photos.length} new photos</a>)
    }else{
      titleComponents.push(' shared a post')
    }

    return (
      <Feed.Summary className={classnames({[style.standaloneSummary]: standalone})}>
        {titleComponents}
        <Feed.Date className={classnames({[style.standaloneSummaryDate]: standalone})}>{this.timeAgo.format(new Date(post.createdAt))}</Feed.Date>
        {
          post.player.username===auth.user.username?
          deleteButton
          :
          null
        }
      </Feed.Summary>
    )
  }

  openModal(index){
    const { photoGallery, post } = this.props
    photoGallery.openModal(post.photos, index)
  }

  addReply(){
    const { post, feed } = this.props
    feed.createDraft(post)
  }

  removeReply(){
    const { post, feed } = this.props
    feed.removeDraft(post)
  }

  setLike(){
    const { feed, auth, post } = this.props
    const activeLike = post.likes.filter(user=>user.username===auth.user.username).length>0
    feed.setPostLike(post.id, !activeLike, auth.user.username)
  }

  generateImage(postElement){
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        return domtoimage.toPng(postElement)
        .then((dataUrl)=>{
          const img = new Image()
          img.src = dataUrl
          return resolve(img)
        })
        .catch(reject)
      },100)
    })
  }

  downloadGif(){
    const { post, spotPlayer } = this.props
    logger.logEvent({category:'Post',action:'Download gif'})
    this.setState({
      busy: true,
    })
    const postElement = ReactDOM.findDOMNode(this.postEditorElement)
    let gif = new GIF({
      workers: 2,
      quality: 17,
      width: postElement.offsetWidth,
      height: postElement.offsetHeight,
      workerScript,
    })
    gif.on('finished', (blob)=> {
      const link = document.createElement('a')
      link.style = 'visibility:hidden; display:none; position: fixed; left -10000px;'
      link.href = URL.createObjectURL(blob)
      link.download = 'pokerface post.gif'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.setState({
        busy: false,
      })
    })

    spotPlayer.reset(post)
    const takeImage = ()=>setTimeout(()=>{
      this.generateImage(postElement).then(img=>{
        gif.addFrame(img, {delay:1000})
        if (spotPlayer.nextStep(post)){
          takeImage()
        //done
        }else{
          this.generateImage(postElement).then(img=>{
            gif.addFrame(img, {delay:2500})
            gif.render()
          })
        }
      })
    })
    takeImage()
  }
  sharePostOnFacebook(){
    const { post } = this.props
    logger.logEvent({category:'Post',action:'Facebook share'})
    const shareurl =`https://www.facebook.com/sharer/sharer.php?u=http://pokerface.io/post/${post.id}&title=Pokerface.io&description=Post by ${post.player.fullname}&picture=http://pokerface.io${require('file-loader!../../assets/logo.png')}`
    window.open(shareurl,'', 'height=570,width=520')
  }

  getLink(){
    const { post } = this.props
    logger.logEvent({category:'Post',action:'Get link'})
    const postUrl = `${location.protocol}//${location.host}/post/${post.id}`
    window.prompt('Copy to clipboard: Ctrl+C, Enter', postUrl)
  }

  render() {
    const { post, auth, standalone } = this.props
    const { replying } = post
    const {busy} = this.state
    const activeLike = post.likes.filter(user=>user.username===auth.user.username).length>0

    return (
      <Dimmer.Dimmable
          as={Feed.Event}
          className={classnames({[style.post]: true, [style.standalone]: standalone })}
          dimmed={busy}
          style={{marginTop:10, marginBottom:10, border: '1px solid #dfdfdf', padding:10, backgroundColor:'#ffffff'}}
      >
        <Dimmer active={busy} inverted>
          <Loader>Generating gif</Loader>
        </Dimmer>
        <Feed.Label
            className={classnames(style.clickable)}
            image={this.getUserImageUrl()}
            onClick={::this.goto}
        />
        <Feed.Content className={classnames({[style.standaloneContent]: standalone})}>
            {this.getFeedSummary()}
          <Feed.Extra
              className={classnames({[style.standaloneText]: standalone})}
              style={{maxWidth:'none'}}
              text
          >
            <PostEditor
                ref={(el)=>this.postEditorElement = el}
                post={post}
                readOnly
                standalone={standalone}
            />
          </Feed.Extra>
          <Feed.Extra className={classnames(style.unselectable)} images>
            {post.photos.map((photo, index)=>
              <PostImage
                  className={classnames({[style.standaloneImage]: standalone})}
                  key={index}
                  onClick={()=>this.openModal(index)}
                  photo={photo}
              />
            )}
          </Feed.Extra>
          <Feed.Meta className={classnames({[style.standaloneContentMeta]: standalone })}>
            <Feed.Like
                className={classnames(style.unselectable, style.blackIcons, {
                  [style.active]: activeLike,
                  [style.standaloneUnselectable]: standalone,
                })}
                onClick={::this.setLike}
            >
              <Icon className={classnames(style.icon)} name="like"/>
              {(post.likes&&post.likes.length)||0} Likes
            </Feed.Like>
            <Feed.Like
                className={classnames(
                  style.unselectable,
                  style.blackIcons,
                  {
                    [style.standaloneUnselectable]: standalone,
                  }
                )}
                onClick={::this.addReply}
            >
              <Icon className={classnames(style.icon)} name="reply" />
              Reply
            </Feed.Like>
            <Dropdown
                text="Share"
            >
              <Dropdown.Menu>
                <Dropdown.Item onClick={::this.sharePostOnFacebook}>
                  <Icon className={classnames(style.icon)} name="share" />
                  Facebook
                </Dropdown.Item>
                <Dropdown.Item onClick={::this.downloadGif}>
                  <Icon className={classnames(style.icon)} name="download" />
                  Download
                </Dropdown.Item>
                <Dropdown.Item onClick={::this.getLink}>
                  <Icon className={classnames(style.icon)} name="linkify" />
                  Get link
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Feed.Meta>
          <Feed.Extra>
            <Comments
                comments={post.comments}
                standalone={standalone}
            />
            {replying&&
              <Reply
                  post={post}
                  removeReply={::this.removeReply}
                  standalone={standalone}
              />}
          </Feed.Extra>
        </Feed.Content>
      </Dimmer.Dimmable>
    )
  }
}
