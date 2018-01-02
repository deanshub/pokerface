// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { Header, Icon, Modal, Button, Form, Input } from 'semantic-ui-react'

@inject('profile')
@inject('auth')
@observer
export default class Navbar extends Component {
  constructor(props){
    super(props)
    const {auth} = props
    this.state = {
      firstname: auth.user.firstname,
      lastname: auth.user.lastname,
    }
  }

  update(){
    const {toggle, profile, auth} = this.props
    const {firstname, lastname} = this.state
    const personalInfo = {
      cover: this.cover.files[0],
      avatar: this.avatar.files[0],
      firstname,
      lastname,
    }
    profile.updatePersonalInfo(personalInfo).then((updatedUser)=>{
      auth.updateUserInfo(updatedUser)
      profile.setCurrentUser(updatedUser)
      toggle()
    }).catch((err)=>{
      console.error(err);
      toggle()
    })
  }

  handleChange(e, {name, value}){
    this.setState({
      [name]: value,
    })
  }

  render() {
    const {open, toggle} = this.props
    const {firstname, lastname} = this.state

    return (
        <Modal dimmer open={open}>
          <Header content="Player details" icon="browser" />
          <Modal.Content>
            <h3>This website uses cookies to ensure the best user experience.</h3>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                    label="First name"
                    name="firstname"
                    onChange={::this.handleChange}
                    placeholder="First name"
                    value={firstname}
                />
                <Form.Input
                    label="Last name"
                    name="lastname"
                    onChange={::this.handleChange}
                    placeholder="Last name"
                    value={lastname}
                />
              </Form.Group>
              <Form.Field inline>
                <label>Profile picture</label>
                <Input
                    as={()=>(
                      <input
                          accept="image/*"
                          ref={(avatar)=>this.avatar=avatar}
                          type="file"
                      />
                    )}
                />
              </Form.Field>
              <Form.Field inline>
                <label>Cover photo</label>
                <Input as={()=>(
                    <input
                        accept="image/*"
                        ref={(cover)=>this.cover=cover}
                        type="file"
                    />
                  )}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
                color="red"
                inverted
                onClick={toggle}
            >
              <Icon name="remove" /> Cancel
            </Button>
            <Button
                color="green"
                inverted
                onClick={::this.update}
            >
              <Icon name="checkmark" /> Update
            </Button>
          </Modal.Actions>
        </Modal>
    )
  }
}
