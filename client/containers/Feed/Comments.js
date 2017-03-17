// @flow
import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react'
import { Comment } from 'semantic-ui-react'
import PostComment from './PostComment'

@observer
export default class Comments extends Component {
  render() {
    const { comments } = this.props
    return (
      <Comment.Group>
        {comments.map(comment=><PostComment key={comment.id} comment={comment}/>)}
      </Comment.Group>
    )
  }
}
