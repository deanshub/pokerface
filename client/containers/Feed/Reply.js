// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Form, Button, Image, Divider } from 'semantic-ui-react'

@inject('auth')
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

  render() {
    const { post, auth, removeReply } = this.props
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
          <Form.TextArea
              autoHeight
              placeholder="Comment here"
              width={15}
          />
        </Form.Group>
        <Button
            content="Add Reply"
            icon="edit"
            labelPosition="left"
            primary
            size="tiny"
        />
        <Button
            content="Remove Reply"
            icon="remove"
            labelPosition="left"
            onClick={removeReply}
            size="tiny"
        />
      </Form>
    )
  }
}
