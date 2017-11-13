// @flow

import React, { Component, PropTypes } from 'react'
import { Header, Form, Button, Message } from 'semantic-ui-react'
import request from 'superagent'

import logger from '../../utils/logger'
import {viewParam} from '../../utils/generalUtils'

export default class SignupForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      signingupInPorgress: false,
      signingupSuccess: false,
      signingupInFail: false,
      signingupFailMessage: null,
    }
  }

  handleSignup(event){
    event.preventDefault()
    const {firstName, lastName, email} = this.state
    this.setState({
      signingupInPorgress: true,
    })

    request.post('/api/signup')
      .send({
        firstName,
        lastName,
        email,
      }).then(() => {
        this.setState({
          signingupInPorgress: false,
          signingupSuccess: true,
        })
      }).catch((err)=>{
        console.error(err)
        let signingupFailMessage = viewParam('response.body.error', err)
        if (!signingupFailMessage){
          signingupFailMessage='An unknown error occurred, please try again later'
        }
        this.setState({
          signingupInPorgress: false,
          signingupInFail: true,
          signingupFailMessage
        })
      })
  }

  handleInputChange(e, {name, value}){
    this.setState({
      [name]: value,
    })
  }

  render() {
    const {
      signingupInPorgress,
      signingupSuccess,
      signingupFailMessage,
      signingupInFail,
    } = this.state

    return (
      <Form
          loading={signingupInPorgress}
          onSubmit={::this.handleSignup}
          success={signingupSuccess}
          error={signingupInFail}
      >
        <Header size="medium">Sign-Up</Header>
        <Form.Input
            label="E-mail"
            name="email"
            onChange={::this.handleInputChange}
            required
            type="email"
        />
        <Form.Input
            label="First Name"
            name="firstName"
            onChange={::this.handleInputChange}
            required
        />
        <Form.Input
            label="Last Name"
            name="lastName"
            onChange={::this.handleInputChange}
            required
        />
        <Button primary type="submit">Sign-Up</Button>
          <Message
              content="You're all signed up for Pokerface.io,  please check your email for further details"
              header="Welcome!"
              success
          />
          <Message
              content={signingupFailMessage}
              error
              header="Sign up error!"
          />
      </Form>
    )
  }
}
