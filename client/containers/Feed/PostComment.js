// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Comment, Icon, Popup, Button } from 'semantic-ui-react'
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
    standalone: PropTypes.bool,
  }

  constructor(props){
    super(props)
    this.timeAgo = new TimeAgo('en-US')
  }

  goto(){
    const {comment, routing, auth} = this.props
    if (comment.owner.username===auth.user.username){
      routing.push('/profile')
    }else{
      routing.push(`/profile/${comment.owner.username}`)
    }
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
    const { comment, auth, standalone } = this.props
    const activeLike = comment.likes.filter((user)=>user.username===auth.user.username).length>0


    const deleteButton = (
      <Popup
          content={
            <div>
              Are you sure?
              <Button.Group compact style={{marginLeft:10}}>
                <Button
                    basic
                    color="green"
                    onClick={::this.deleteComment}
                >
                  Yes
                </Button>
                <Button
                    basic
                    color="red"
                    onClick={::this.closeDeletePopup}
                >
                  No
                </Button>
              </Button.Group>
            </div>
          }
          on="click"
          onClose={::this.closeDeletePopup}
          onOpen={::this.openDeletePopup}
          open={comment.deletePopupOpen}
          trigger={
            <Button
                basic
                compact
                floated="right"
                icon="delete"
                size="small"
            />
          }
      />
    )

    return (
      <Comment>
        <Comment.Avatar
            as="a"
            onClick={::this.goto}
            src={this.getUserImageUrl()}
        />
        <Comment.Content className={classnames({[style.standaloneComment]: standalone})}>
          <Comment.Author as="a" onClick={::this.goto}>{this.getUserFullName()}</Comment.Author>
          <Comment.Metadata>
            <div>{this.timeAgo.format(new Date(comment.createdAt))}</div>
          </Comment.Metadata>
          {
            comment.owner.username===auth.user.username?
            deleteButton
            :
            null
          }
          <Comment.Text className={classnames({[style.standaloneCommentText]: standalone})} style={{width:'95%'}}>
            <PostEditor
                post={comment}
                readOnly
            />
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
