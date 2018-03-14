// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Button from '../../components/basic/Button'
import BasicImage from '../../components/basic/Image'
import Dimmer from '../../components/basic/Dimmer'
import Tooltip from '../../components/basic/Tooltip'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'
import ReactDOM from 'react-dom'
import domtoimage from 'dom-to-image'
import { NavLink } from 'react-router-dom'
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
import eventIcon from '../../assets/post/date-white.png'

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
          img.onload=()=>{
            resolve(img)
          }
          img.onerror=reject
          img.src = dataUrl
        })
        .catch(err=>{
          console.error(err)
          reject(err)
        })
      },300)
    })
  }

  downloadGif(){
    logger.logEvent({category:'Post',action:'Download gif'})
    this.setState({
      busy: true,
    })
    this.generateGif().then(blob=>{
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
    }).catch(err=>{
      console.error(err)
      this.setState({
        busy: false,
      })
    })
  }
  generateGif(){
    return new Promise((resolve, reject)=>{
      const { post, spotPlayer } = this.props
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
        resolve(blob)
      })

      spotPlayer.reset(post)
      const takeImage = ()=>setTimeout(()=>{
        return this.generateImage(svgPostElement).then(img=>{
          gif.addFrame(img, {delay:1500})
          if (spotPlayer.nextStep(post)){
            return takeImage()
            //done
          }else{
            return this.generateImage(svgPostElement).then(img=>{
              gif.addFrame(img, {delay:2500})
              gif.render()
            })
          }
        })
        // .catch(err=>{
        //   console.error(err)
        //   this.setState({
        //     busy: false,
        //   })
        // })
      })
      takeImage()
    })
  }
  sharePostOnFacebook(){
    const { post } = this.props
    logger.logEvent({category:'Post',action:'Facebook share'})
    const shareurl =`https://www.facebook.com/sharer/sharer.php?u=https://pokerface.io/post/${post.id}&title=Pokerface.io&description=Post by ${post.owner.fullname}&picture=https://pokerface.io${require('file-loader!../../assets/logo.png')}`
    window.open(shareurl,'', 'height=570,width=520')
  }

  shareGif(){
    const { post } = this.props
    logger.logEvent({category:'Post',action:'Download gif'})
    this.setState({
      busy: true,
    })
    this.generateGif().then(blob=>{
      const title = 'Pokerface.io'
      const text = `Post by ${post.owner.fullname}`

      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const base64data = reader.result
        // console.log(base64data);
        this.setState({
          busy: false,
        })
        navigator.share({url:base64data, title, text}).catch(console.error)
      }
    }).catch(err=>{
      console.error(err)
      this.setState({
        busy: false,
      })
    })
  }

  shareMobile(){
    const { post } = this.props
    logger.logEvent({category:'Post',action:'Mobile share'})
    const shareurl = `https://pokerface.io/post/${post.id}`
    const title = 'Pokerface.io'
    const text = `Post by ${post.owner.fullname}`
    navigator.share({url:shareurl, title, text}).catch(console.error)
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
      <Dimmer
          busy={busy}
          className={classnames(style.postContainer)}
          label="Downloading gif"
      >
        <div className={classnames(style.post)}>
        <div className={classnames(style.postHeader)}>
          <div className={classnames(style.leftPane)}>
            <BasicImage
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
            <Tooltip
                placement="bottom-end"
                trigger={
                  <Button
                      leftIcon="share"
                      small
                  />
                }
            >
              <div className={classnames(style.shareMenu)}>
                {
                  navigator.share?
                  <Button
                      onClick={::this.shareMobile}
                      simple
                      small
                      style={{padding: '0.5em 0'}}
                  >
                    Share Link...
                  </Button>
                  :
                  <Button
                      onClick={::this.sharePostOnFacebook}
                      simple
                      small
                      style={{padding: '0.5em 0'}}
                  >
                    Facebook
                  </Button>
                }
                {
                  post.spot!==undefined&&!navigator.share&&
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
                    style={{padding: '0.5em 0', minWidth: 'auto'}}
                >
                  Get Link
                </Button>
              </div>
            </Tooltip>
            {
              post.owner.username===auth.user.username&&
              <Tooltip
                  placement="bottom-end"
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
              </Tooltip>
            }
          </div>
        </div>
        {post.event&&!routing.location.pathname.startsWith('/events/')&&
          <NavLink
              className={classnames(style.eventSection)}
              exact
              to={`/events/${post.event.id}`}
          >
            <img src={eventIcon} style={{marginRight:'0.5em'}}/> at
            <div className={classnames(style.eventLocation)}>{post.event.location}</div>
          </NavLink>
        }
        <div className={classnames(style.postContent,{[style.noCommentsSection]:(!post.comments.length>0&&!auth.user.username)})}>
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
                    key={index}
                    onClick={()=>this.openModal(index)}
                    photo={photo}
                />
              )}
            </div>
          }
        </div>
        {
          (post.comments.length>0||auth.user.username!==undefined)&&
          <div className={classnames(style.postComments)}>
            <Comments
                comments={post.comments}
            />
            {auth.isLoggedIn?
              <Reply
                  post={post}
                  removeReply={::this.removeReply}
                  standalone={standalone}
              />
              :null
          }
          </div>
        }
        </div>
      </Dimmer>
    )
  }
}
