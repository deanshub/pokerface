// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Feed, Icon } from 'semantic-ui-react'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'
import { EditorState, convertFromRaw } from 'draft-js'

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
    post: PropTypes.object,
    standalone: PropTypes.bool,
  }

  constructor(props){
    super(props)
    this.timeAgo = new TimeAgo('en-US')
    let content = JSON.parse(props.post.content)
    if (!content.entityMap){
      content.entityMap={}
    }
    const parsedContent = convertFromRaw(content, 'update-contentState')
    this.state = {
      replying: false,
      postEditorState: EditorState.createWithContent(parsedContent),
    }
  }

  // componentWillReceiveProps(nextProps){
  //   this.setState({
  //     postEditorState: EditorState.createWithContent(convertFromRaw(JSON.parse(nextProps.post.content), 'update-contentState')),
  //   })
  // }

  goto(){
    const {post, routing, auth} = this.props
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
    const { feed, auth, post } = this.props
    const activeLike = post.likes.filter(user=>user.username===auth.user.username).length>0
    feed.setPostLike(post.id, !activeLike, auth.user.username)
  }

  sharePost(){
    const { post } = this.props
    const shareurl =`https://www.facebook.com/sharer/sharer.php?u=http://pokerface.io/post/${post.id}&title=Pokerface.io&description=Post by ${post.player.fullname}&picture=http://pokerface.io${require('file-loader!../../assets/fav2.jpg')}`
    window.open(shareurl,'', 'height=570,width=520')
  }

  render() {
    const { post, auth, standalone } = this.props
    const { replying } = this.state
    const activeLike = post.likes.filter(user=>user.username===auth.user.username).length>0
    const {postEditorState} = this.state

    return (
      <Feed.Event className={classnames(style.post)} style={{marginTop:10, marginBottom:10, border: '1px solid #dfdfdf', padding:10, backgroundColor:'#ffffff'}}>
        <Feed.Label
            className={classnames({[style.standalone]:standalone, [style.clickable]: true})}
            image={this.getUserImageUrl()}
            onClick={::this.goto}
        />
        <Feed.Content>
            {this.getFeedSummary()}
          <Feed.Extra text>
            <PostEditor
                editorState={postEditorState}
                onChange={(editorState)=>this.setState({postEditorState: editorState})}
                readOnly
            />
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
            <Feed.Like
                className={classnames(style.unselectable, style.blackIcons)}
                onClick={::this.sharePost}
            >
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
