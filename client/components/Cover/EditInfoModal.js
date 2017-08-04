// @flow

import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Header, Icon, Modal, Button, Form, Input } from 'semantic-ui-react'

@inject('profile')
@observer
export default class Navbar extends Component {
  update(){
    const {toggle, profile} = this.props
    profile.updatePersonalInfo(this.cover.files).then(()=>{
      toggle()
    })
  }

  render() {
    const {open,toggle} = this.props

    return (
        <Modal dimmer open={open}>
          <Header icon="browser" content="Player details" />
          <Modal.Content>
            <h3>This website uses cookies to ensure the best user experience.</h3>
            <Form>
              <Form.Group widths="equal">
                <Form.Input label="First name" placeholder="First name" />
                <Form.Input label="Last name" placeholder="Last name" />
              </Form.Group>
              <Form.Field inline>
                <label>Profile picture</label>
                <Input as={()=><input accept="image/*" type="file" />}/>
              </Form.Field>
              <Form.Field inline>
                <label>Cover photo</label>
                <Input as={()=><input accept="image/*" type="file" ref={(cover)=>this.cover=cover} />} />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={toggle} inverted>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green" onClick={::this.update} inverted>
              <Icon name="checkmark" /> Update
            </Button>
          </Modal.Actions>
        </Modal>
    )
  }
}
