// @flow
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Image from '../../components/basic/Image'
import Button from '../../components/basic/Button'
import PostEditor from '../../components/PostEditor'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('feed')
@observer
export default class Reply extends Component {
  constructor(props: Object){
    super(props)
    this.state = {
      avatarImage: props.auth.user.avatar,
    }
  }

  addComment(e){
    const { auth, post, feed } = this.props
    e.preventDefault()
    if (feed.commentDrafts.get(post.id)){
      feed.addComment(post.id, auth.user)
    }
  }
  // removeReply(){
  //   const { feed, post } = this.props
  //   feed.removeDraft(post)
  // }

  createDraft(){
    const { feed, post } = this.props
    if (!feed.commentDrafts.get(post.id)){
      feed.createDraft(post)
    }
  }

  render() {
    const { feed, post, standalone } = this.props
    const {avatarImage} = this.state

    if(!post){
      return null
    }

    return (
      <form
          className={classnames(style.replyContainer)}
          onClick={::this.createDraft}
          onSubmit={::this.addComment}
      >
            {
              avatarImage&&
              <Image
                  avatar
                  src={avatarImage}
                  style={{opacity:feed.commentDrafts.get(post.id)?1:0.7}}
              />
            }
            <div className={classnames(style.commentTextBox)}>
              {
                feed.commentDrafts.get(post.id)?
                <PostEditor
                    placeholder="Write a comment..."
                    post={feed.commentDrafts.get(post.id)}
                />
                :
                <div className={classnames(style.commentPlaceholder)}>
                  Write a comment...
                </div>
              }
              <Button
                  active
                  onClick={::this.addComment}
                  simple
                  style={{ alignSelf: 'flex-end'}}
              >
                Post
              </Button>
            </div>
      </form>
    )
  }
}
