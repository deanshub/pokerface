// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Feed, Icon } from 'semantic-ui-react'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'
import Comments from './Comments'
import Reply from './Reply'
import PostImage from './PostImage'
import classnames from 'classnames'
import style from './style.css'

TimeAgo.locale(timeAgoEnLocale)

@inject('photoGallery')
@inject('routing')
@inject('auth')
@observer
export default class Post extends Component {
  constructor(props){
    super(props)
    this.timeAgo = new TimeAgo('en-US')
    this.state = {
      replying: false,
    }
  }

  static propTypes = {
    post: PropTypes.object,
  }

  goto(){
    const {post, routing, auth} = this.props
    if (post.player.username===auth.user.user){
      routing.push('/profile')
    }else{
      routing.push(`/profile/${post.player.username}`)
    }
  }

  getUserFullName(){
    const { post, auth } = this.props
    return post.player.username===auth.user.user?'You':post.player.fullName
  }
  getUserImageUrl(){
    const { post } = this.props
    return post.player.avatar.includes('http')?post.player.avatar:`images/${post.player.avatar}`
  }

  getFeedSummary(){
    const { post } = this.props
    if (post.photos.length>0) {
      return (
        <Feed.Summary>
          <Feed.User onClick={::this.goto}>{this.getUserFullName()}</Feed.User> added <a onClick={()=>this.openModal()}>{post.photos.length} new photos</a>
          <Feed.Date>{this.timeAgo.format(new Date(post.createdAt))}</Feed.Date>
        </Feed.Summary>
      )
    }else{
      return (
        <Feed.Summary>
          <Feed.User onClick={::this.goto}>{this.getUserFullName()}</Feed.User> shared a post
          <Feed.Date>{this.timeAgo.format(new Date(post.createdAt))}</Feed.Date>
        </Feed.Summary>
      )
    }
  }

  openModal(index){
    const { photoGallery, post } = this.props
    photoGallery.openModal(post.photos, index)
  }

  addReply(){
    this.setState({
      replying: true,
    })
  }

  removeReply(){
    this.setState({
      replying: false,
    })
  }

  setLike(){
    console.log(this.props.post);
  }

  render() {
    const { post, auth } = this.props
    const { replying } = this.state
    const activeLike = post.likes.includes(auth.user.user)

    return (
      <Feed.Event className={classnames(style.post)} style={{marginTop:10, marginBottom:10, border: '1px solid #dfdfdf', padding:10, backgroundColor:'#ffffff'}}>
        <Feed.Label image={this.getUserImageUrl()}  onClick={::this.goto}/>
        <Feed.Content>
            {this.getFeedSummary()}
          <Feed.Extra text>
            {post.content}
          </Feed.Extra>
          <Feed.Extra className={classnames(style.unselectable)} images>
            {post.photos.map((photo, index)=>
              <PostImage
                  key={Math.random()}
                  onClick={()=>this.openModal(index)}
                  photo={photo}
              />
            )}
          </Feed.Extra>
          <Feed.Meta>
            <Feed.Like
                className={classnames(style.unselectable, style.blackIcons, {
                  [style.active]: activeLike,
                })}
                onClick={::this.setLike}
            >
              <Icon className={classnames(style.icon)} name="like"/>
              {(post.likes&&post.likes.length)||0} Likes
            </Feed.Like>
            <Feed.Like className={classnames(style.unselectable, style.blackIcons)} onClick={::this.addReply}>
              <Icon className={classnames(style.icon)} name="reply" />
              Reply
            </Feed.Like>
            <Feed.Like className={classnames(style.unselectable, style.blackIcons)}>
              <Icon className={classnames(style.icon)} name="share" />
              Share
            </Feed.Like>
          </Feed.Meta>
          <Feed.Extra>
            <Comments
                comments={post.comments}
            />
            {replying&&<Reply post={post} removeReply={::this.removeReply}/>}
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
    )
  }
}
