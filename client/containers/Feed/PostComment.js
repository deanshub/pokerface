// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Comment, Icon } from 'semantic-ui-react'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'

TimeAgo.locale(timeAgoEnLocale)

@inject('routing')
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
    const {post, routing} = this.props
    routing.push(`/profile/${post.player.username}`)
  }

  render() {
    const { comment } = this.props
    return (
      <Comment>
        <Comment.Avatar as="a" src={comment.player.avatar} />
        <Comment.Content>
          <Comment.Author as="a">{comment.player.fullName}</Comment.Author>
          <Comment.Metadata>
            <div>{this.timeAgo.format(new Date(comment.createdAt))}</div>
          </Comment.Metadata>
          <Comment.Text>
            {comment.content}
          </Comment.Text>
          <Comment.Actions>
            <Comment.Action>
              <Icon name="like" />
              {comment.likes.length} Likes
            </Comment.Action>
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    )
  }
}
