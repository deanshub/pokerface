// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Image from '../../components/basic/Image'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'
import PostEditor from '../../components/PostEditor'
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

  getUserFullName(){
    const { comment, auth } = this.props
    return comment.owner.username===auth.user.username?'You':comment.owner.fullname
  }
  getUserImageUrl(){
    const { comment } = this.props
    return comment.owner.avatar
  }

  setLike(){
    const { feed, auth, comment } = this.props
    const activeLike = comment.likes.filter((user)=>user.username===auth.user.username).length>0
    feed.setCommentLike(comment.post.id, comment.id, !activeLike, auth.user.username)
  }

  openDeletePopup(){
    const { comment } = this.props
    comment.deletePopupOpen = true
  }
  closeDeletePopup(){
    const { comment } = this.props
    comment.deletePopupOpen = false
  }

  deleteComment(){
    const { comment, feed }= this.props
    feed.deleteComment(comment)
  }

  render() {
    const { comment, auth, routing } = this.props
    const activeLike = comment.likes.filter((user)=>user.username===auth.user.username).length>0

    return (
      <div className={classnames(style.commentContainer)}>
        <Image
            avatar
            href={`/profile/${comment.owner.username}`}
            src={this.getUserImageUrl()}
        />
        <div className={classnames(style.commentRightPane)}>
          <div className={classnames(style.commentDescription)}>
            <div
                className={classnames(style.commentOwner)}
                onClick={()=>routing.push(`/profile/${comment.owner.username}`)}
            >
              {this.getUserFullName()}
            </div>
            <div className={classnames(style.divider)}/>
            <div className={classnames(style.commentTime)}>{this.timeAgo.format(new Date(comment.createdAt))}</div>
            <div className={classnames(style.divider)}/>
            <a className={classnames(style.commentLike, {[style.active]:activeLike})} onClick={::this.setLike}>
              Like
            </a>
            {
              comment.likes.length>0&&
              <div className={classnames(style.commentLikeLength)}>
                {`(${comment.likes.length})`}
              </div>
            }
            {
              comment.owner.username===auth.user.username&&
              <div className={classnames(style.divider)}/>
            }
            {
              comment.owner.username===auth.user.username&&
              <a className={classnames(style.commentDelete)} onClick={::this.deleteComment}>
                Delete
              </a>
            }
          </div>
          <div className={classnames(style.commentContent)}>
            <PostEditor
                post={comment}
                readOnly
            />
          </div>
        </div>
      </div>
    )
  }
}
