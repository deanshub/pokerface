// @flow
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { Form, Button, Image, Divider } from 'semantic-ui-react'
import PostEditor from '../../components/PostEditor'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('feed')
@observer
export default class Comments extends Component {
  constructor(props: Object){
    super(props)
    this.state = {
      avatarImage: undefined,
    }
  }

  componentDidMount(){
    const { auth } = this.props
    if (auth.user.avatar){
      this.setState({
        avatarImage:auth.user.avatar,
      })
    }
  }

  addComment(){
    const { post, feed } = this.props
    feed.addComment(post.id)
  }
  removeReply(){
    const { feed, post } = this.props
    feed.removeDraft(post)
  }

  render() {
    const { feed, post, standalone } = this.props
    const {avatarImage} = this.state

    return (
      <Form
          onSubmit={(e)=>{e.preventDefault()}}
          reply
      >
        <Divider />
        <Form.Group inline>
          <Form.Field width={1}>
            {
              avatarImage&&
              <Image
                  src={avatarImage}
              />
            }
          </Form.Field>
          <Form.Field width={15}>
            <PostEditor
                placeholder="Add comment"
                post={feed.commentDrafts.get(post.id)}
            />
          </Form.Field>
        </Form.Group>
        <Button
            className={classnames({[style.standaloneReply]: standalone})}
            content="Add Reply"
            icon="edit"
            labelPosition="left"
            onClick={::this.addComment}
            primary
            size="tiny"
        />
        <Button
            className={classnames({[style.standaloneReply]: standalone})}
            content="Cancel"
            icon="remove"
            labelPosition="left"
            onClick={::this.removeReply}
            size="tiny"
        />
      </Form>
    )
  }
}
