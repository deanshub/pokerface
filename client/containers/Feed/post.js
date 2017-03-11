// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Feed, Icon } from 'semantic-ui-react'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'
import classnames from 'classnames'
import style from './style.css'

TimeAgo.locale(timeAgoEnLocale)

@inject('feed')
@inject('photoGallery')
@inject('routing')
@observer
export default class Post extends Component {
  constructor(props){
    super(props)
    this.timeAgo = new TimeAgo('en-US')
  }

  static propTypes = {
    post: PropTypes.object,
  }

  goto(){
    const {post, routing} = this.props
    routing.push(`/profile/${post.player.username}`)
  }

  getFeedSummary(){
    const { post } = this.props
    if (post.photos.length>0) {
      return (
        <Feed.Summary>
          <Feed.User onClick={::this.goto}>{post.player.fullName}</Feed.User> added <a onClick={()=>this.openModal()}>{post.photos.length} new photos</a>
          <Feed.Date>{this.timeAgo.format(new Date(post.createdAt))}</Feed.Date>
        </Feed.Summary>
      )
    }else{
      return (
        <Feed.Summary>
          <Feed.User>{post.player.fullName}</Feed.User> shared a post
          <Feed.Date>{this.timeAgo.format(new Date(post.createdAt))}</Feed.Date>
        </Feed.Summary>
      )
    }
  }

  openModal(index){
    const { photoGallery, post } = this.props
    photoGallery.openModal(post.photos, index)
  }

  render() {
    const { post } = this.props

    return (
      <Feed.Event>
        <Feed.Label image={post.avatar} />
        <Feed.Content>
            {this.getFeedSummary()}
          <Feed.Extra text>
            {post.content}
          </Feed.Extra>
          <Feed.Extra className={classnames(style.unselectable)} images>
            {post.photos.map((photo, index)=>
              <a key={Math.random()} onClick={()=>this.openModal(index)}>
                <img draggable={false} src={photo} />
              </a>
            )}
          </Feed.Extra>
          <Feed.Meta>
            <Feed.Like className={classnames(style.unselectable)}>
              <Icon name="like" />
              {post.likes||0} Likes
            </Feed.Like>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    )
  }
}
