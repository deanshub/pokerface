// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Feed, Icon, Button, Popup } from 'semantic-ui-react'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'

import Comments from './Comments'
import Reply from './Reply'
import PostImage from './PostImage'
import PostEditor from '../../components/PostEditor'
import classnames from 'classnames'
import style from './style.css'

TimeAgo.locale(timeAgoEnLocale)

@inject('photoGallery')
@inject('routing')
@inject('auth')
@inject('feed')
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

  sharePost(){
    const { post } = this.props
    const shareurl =`https://www.facebook.com/sharer/sharer.php?u=http://pokerface.io/post/${post.id}&title=Pokerface.io&description=Post by ${post.player.fullname}&picture=http://pokerface.io${require('file-loader!../../assets/logo.png')}`
    window.open(shareurl,'', 'height=570,width=520')
  }

  render() {
    const { post, auth, standalone } = this.props
    const { replying } = post
    const activeLike = post.likes.filter(user=>user.username===auth.user.username).length>0

    return (
      <Feed.Event className={classnames({[style.post]: true, [style.standalone]: standalone })} style={{marginTop:10, marginBottom:10, border: '1px solid #dfdfdf', padding:10, backgroundColor:'#ffffff'}}>
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
            <Feed.Like
                className={classnames(
                  style.unselectable,
                  style.blackIcons,
                  {
                    [style.standaloneUnselectable]: standalone,
                  }
                )}
                onClick={::this.sharePost}
            >
              <Icon className={classnames(style.icon)} name="share" />
              Share
            </Feed.Like>
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
      </Feed.Event>
    )
  }
}
