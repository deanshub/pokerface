// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { Feed, Icon, Popup, Dropdown, Dimmer, Loader } from 'semantic-ui-react'
import Button from '../../components/basic/Button'
import Image from '../../components/basic/Image'
import IsUserLoggedIn from '../../components/IsUserLoggedIn'
import DropDown from '../../components/basic/DropDown'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'
import ReactDOM from 'react-dom'
import domtoimage from 'dom-to-image'
// import imageUtils from './imageUtils'
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

  getUserFullName(){
    const { post, auth } = this.props
    return post.owner.username===auth.user.username?'You':post.owner.fullname
  }
  getUserImageUrl(){
    const { post } = this.props
    return post.owner.avatar
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
        .catch(err=>{
          console.error(err)
          reject(err)
        })
        // const canvas = imageUtils.newCanvas(postElement)
        // return imageUtils.toImage(postElement, canvas).then((dataUrl)=>{
        //   const img = new Image()
        //   img.onload = ()=>{
        //     resolve(img)
        //   }
        //   img.onerror = reject
        //   img.src = dataUrl
        // }).catch(reject)
      },300)
    })
  }

  downloadGif(){
    const { post, spotPlayer } = this.props
    logger.logEvent({category:'Post',action:'Download gif'})
    this.setState({
      busy: true,
    })
    const postElement = ReactDOM.findDOMNode(this.postEditorElement)
    const svgPostElement = postElement.querySelector('article[class]')
    let gif = new GIF({
      workers: 2,
      quality: 20,
      width: svgPostElement.offsetWidth,
      height: svgPostElement.offsetHeight,
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
      return this.generateImage(svgPostElement).then(img=>{
        gif.addFrame(img, {delay:1000})
        if (spotPlayer.nextStep(post)){
          return takeImage()
        //done
        }else{
          return this.generateImage(svgPostElement).then(img=>{
            gif.addFrame(img, {delay:2500})
            gif.render()
          })
        }
      }).catch(err=>{
        console.error(err)
        this.setState({
          busy: false,
        })
      })
    })
    takeImage()
  }
  sharePostOnFacebook(){
    const { post } = this.props
    logger.logEvent({category:'Post',action:'Facebook share'})
    const shareurl =`https://www.facebook.com/sharer/sharer.php?u=http://pokerface.io/post/${post.id}&title=Pokerface.io&description=Post by ${post.owner.fullname}&picture=http://pokerface.io${require('file-loader!../../assets/logo.png')}`
    window.open(shareurl,'', 'height=570,width=520')
  }

  getLink(){
    const { post } = this.props
    logger.logEvent({category:'Post',action:'Get link'})
    const postUrl = `${location.protocol}//${location.host}/post/${post.id}`
    window.prompt('Copy to clipboard: Ctrl+C, Enter', postUrl)
  }

  render() {
    const { post, auth, standalone, routing } = this.props
    const {busy} = this.state
    const activeLike = post.likes.filter(user=>user.username===auth.user.username).length>0

    return (
      <Dimmer.Dimmable
          as={Feed.Event}
          className={classnames({[style.post]: true, [style.standalone]: standalone })}
          dimmed={busy}
          style={{marginTop:10, marginBottom:10, border: '1px solid #dfdfdf', backgroundColor:'#ffffff', padding: 0}}
      >
        <Dimmer active={busy} inverted>
          <Loader>Generating gif</Loader>
        </Dimmer>
        <div className={classnames(style.postHeader)}>
          <div className={classnames(style.leftPane)}>
            <Image
                avatar
                href={`/profile/${post.owner.username}`}
                src={this.getUserImageUrl()}
            />
            <div className={classnames(style.headerTextContainer)}>
              <div
                  className={classnames(style.headerTextTitle)}
                  onClick={()=>routing.push(`/profile/${post.owner.username}`)}
              >
                {this.getUserFullName()}
              </div>
              <div className={classnames(style.headerTextTime)}>
                {this.timeAgo.format(new Date(post.createdAt))}
              </div>
            </div>
          </div>
          <div className={classnames(style.rightPane)}>
            <div className={classnames(style.likeContainer)}>
              <Button
                  active={activeLike}
                  leftIcon="like"
                  onClick={::this.setLike}
                  small
              />
              {
                post.likes&&post.likes.length>0&&
                <div>
                  {`(${post.likes.length})`}
                </div>
              }
            </div>
            <DropDown
                trigger={
                  <Button
                      leftIcon="share"
                      small
                  />
                }
            >
              <div className={classnames(style.shareMenu)}>
                <Button
                    onClick={::this.sharePostOnFacebook}
                    simple
                    small
                    style={{padding: '0.5em 0'}}
                >
                  Facebook
                </Button>
                {
                  post.spot!==undefined&&
                  <Button
                      onClick={::this.downloadGif}
                      simple
                      small
                      style={{padding: '0.5em 0'}}
                  >
                      Download Gif
                  </Button>
                }
                <Button
                    onClick={::this.getLink}
                    simple
                    small
                    style={{padding: '0.5em 0'}}
                >
                  Get Link
                </Button>
              </div>
            </DropDown>
            {
              post.owner.username===auth.user.username&&
              <DropDown
                  trigger={
                    <Button
                        leftIcon="actionMenu"
                        small
                    />
                  }
              >
                <div className={classnames(style.shareMenu)}>
                  <Button
                      onClick={::this.deletePost}
                      simple
                      small
                      style={{padding: '0.5em 0'}}
                  >
                      Delete Post
                  </Button>
                </div>
              </DropDown>
            }
          </div>
        </div>
        <div className={classnames(style.postContent)}>
          <PostEditor
              post={post}
              readOnly
              ref={(el)=>this.postEditorElement = el}
              standalone={standalone}
          />
          {
            post.photos.length>0&&
            <div className={classnames(style.photosContainer)}>
              {post.photos.map((photo, index)=>
                <PostImage
                    className={classnames({[style.standaloneImage]: standalone})}
                    key={index}
                    onClick={()=>this.openModal(index)}
                    photo={photo}
                />
              )}
            </div>
          }
        </div>
        <div className={classnames(style.postComments)}>
          <Comments
              comments={post.comments}
              standalone={standalone}
          />
          <IsUserLoggedIn>
            <Reply
                post={post}
                removeReply={::this.removeReply}
                standalone={standalone}
            />
          </IsUserLoggedIn>
          <IsUserLoggedIn opposite>
            <div className={classnames(style.signupContainer)}>
              <Button
                  onClick={()=>routing.push(`/login?url=/post/${post.id}`)}
                  primary
                  style={{width:'30em', textTransform: 'uppercase'}}
              >
                Join The Pokerface Community - Sign Up
              </Button>
            </div>
          </IsUserLoggedIn>
        </div>
      </Dimmer.Dimmable>
    )
  }
}
