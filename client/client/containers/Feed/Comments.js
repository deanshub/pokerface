// @flow
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import PostComment from './PostComment'

@observer
export default class Comments extends Component {
  render() {
    const { comments } = this.props
    return (
      <React.Fragment>
        {comments.map(comment=>(
          <PostComment
              comment={comment}
              key={comment.id}
          />))
        }
      </React.Fragment>
    )
  }
}
