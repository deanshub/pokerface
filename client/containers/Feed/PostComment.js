// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Comment, Icon } from 'semantic-ui-react'
import TimeAgo from 'javascript-time-ago'
import timeAgoEnLocale from 'javascript-time-ago/locales/en'
import { EditorState, convertFromRaw } from 'draft-js'
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
    let content = JSON.parse(props.comment.content)
    if (!content.entityMap){
      content.entityMap={}
    }
    const parsedContent = convertFromRaw(content, 'update-contentState')
    this.state={
      commentEditorState: EditorState.createWithContent(parsedContent),
    }
  }

  // componentWillReceiveProps(nextProps){
  //   this.setState({
  //     commentEditorState: EditorState.createWithContent(convertFromRaw(JSON.parse(nextProps.comment.content), 'update-contentState')),
  //   })
  // }

  goto(){
    const {comment, routing, auth} = this.props
    if (comment.player.username===auth.user.username){
      routing.push('/profile')
    }else{
      routing.push(`/profile/${comment.player.username}`)
    }
  }

  getUserFullName(){
    const { comment, auth } = this.props
    return comment.player.username===auth.user.username?'You':comment.player.fullname
  }
  getUserImageUrl(){
    const { comment } = this.props
    return comment.player.avatar
  }

  setLike(){
    const { feed, auth, comment } = this.props
    const activeLike = comment.likes.filter((user)=>user.username===auth.user.username).length>0
    feed.setCommentLike(comment.post.id, comment.id, !activeLike, auth.user.username)
  }

  render() {
    const { comment, auth } = this.props
    const activeLike = comment.likes.filter((user)=>user.username===auth.user.username).length>0
    const {commentEditorState} = this.state

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
            <PostEditor
                editorState={commentEditorState}
                onChange={(editorState)=>this.setState({commentEditorState:editorState})}
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
