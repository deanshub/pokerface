// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Comment, Icon } from 'semantic-ui-react'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'
import classnames from 'classnames'
import style from './style.css'


TimeAgo.locale(timeAgoEnLocale)

@inject('routing')
@inject('auth')
@inject('feed')
@observer
export default class PostComment extends Component {
  static propTypes = {
    comment: PropTypes.object,
  }

  constructor(props){
    super(props)
    this.timeAgo = new TimeAgo('en-US')
  }

  goto(){
    const {comment, routing, auth} = this.props
    if (comment.player.username===auth.user.user){
      routing.push('/profile')
    }else{
      routing.push(`/profile/${comment.player.username}`)
    }
  }

  getUserFullName(){
    const { comment, auth } = this.props
    return comment.player.username===auth.user.user?'You':comment.player.fullName
  }
  getUserImageUrl(){
    const { comment } = this.props
    return comment.player.avatar.includes('http')?comment.player.avatar:`images/${comment.player.avatar}`
  }

  setLike(){
    const { feed, auth, comment } = this.props
    const activeLike = comment.likes.includes(auth.user.user)
    feed.setCommentLike(comment.post.id, comment.id, !activeLike, auth.user.user)
  }

  render() {
    const { comment, auth } = this.props
    const activeLike = comment.likes.includes(auth.user.user)
    return (
      <Comment>
        <Comment.Avatar
            as="a"
            onClick={::this.goto}
            src={this.getUserImageUrl()}
        />
        <Comment.Content>
          <Comment.Author as="a" onClick={::this.goto}>{this.getUserFullName()}</Comment.Author>
          <Comment.Metadata>
            <div>{this.timeAgo.format(new Date(comment.createdAt))}</div>
          </Comment.Metadata>
          <Comment.Text>
            {comment.content}
          </Comment.Text>
          <Comment.Actions onClick={::this.setLike}>
            <Comment.Action className={classnames({[style.active]: activeLike})}>
              <Icon className={classnames(style.icon)} name="like"/>
              {comment.likes.length} Likes
            </Comment.Action>
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    )
  }
}
