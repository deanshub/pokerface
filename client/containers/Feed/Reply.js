// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Form, Button, Image, Divider } from 'semantic-ui-react'
import PostEditor from '../../components/PostEditor'

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
    import(`../../assets/images/${auth.user.avatarImage}`).then(avatarImage=>{
      this.setState({
        avatarImage,
      })
    })
  }

  addComment(){
    const { post, feed } = this.props
    feed.addComment(post.id)
  }
  updateComment(editorState){
    const { post, feed } = this.props
    feed.updateComment(post.id, editorState)
  }
  removeReply(){
    const { feed, post, removeReply } = this.props
    feed.updateComment(post.id)
    removeReply()
  }

  render() {
    const { feed, post, auth } = this.props
    const {avatarImage} = this.state

    return (
      <Form
          onSubmit={(e)=>{e.preventDefault()}}
          reply
      >
        <Divider />
        <Form.Group inline>
          <Form.Field width={1}>
            <Image
                src={avatarImage}
            />
          </Form.Field>
          <Form.Field width={15}>
            <PostEditor
                editorState={feed.rawComments[post.id]}
                onChange={::this.updateComment}
            />
          </Form.Field>
        </Form.Group>
        <Button
            content="Add Reply"
            icon="edit"
            labelPosition="left"
            onClick={::this.addComment}
            primary
            size="tiny"
        />
        <Button
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
