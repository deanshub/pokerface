// @flow
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Comment } from 'semantic-ui-react'
import PostComment from './PostComment'

@observer
export default class Comments extends Component {
  render() {
    const { comments, standalone } = this.props
    return (
      <Comment.Group style={{maxWidth:'98%'}}>
        {comments.map(comment=>(
          <PostComment
              comment={comment}
              key={comment.id}
              standalone={standalone}
          />))
        }
      </Comment.Group>
    )
  }
}
