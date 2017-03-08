// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Feed, Icon } from 'semantic-ui-react'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'

TimeAgo.locale(timeAgoEnLocale)

@inject('feed')
@inject('photoGallery')
@observer
export default class Post extends Component {
  constructor(props){
    super(props)
    this.timeAgo = new TimeAgo('en-US')
  }

  getFeedSummary(){
    const { post } = this.props
    if (post.photos.length>0) {
      return (
        <Feed.Summary>
          <Feed.User>{post.player.fullName}</Feed.User> added <a>{post.photos.length} new photos</a>
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

  openModal(photo){
    const { photoGallery } = this.props
    photoGallery.openModal([photo])
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
          <Feed.Extra images>
            {post.photos.map(photo=><a onClick={()=>this.openModal(photo)} key={Math.random()}><img src={photo} /></a>)}
          </Feed.Extra>
          <Feed.Meta>
            <Feed.Like>
              <Icon name='like' />
              {post.likes||0} Likes
            </Feed.Like>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    )
  }
}
