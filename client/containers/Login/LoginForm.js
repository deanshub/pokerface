// @flow

import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { parse } from 'qs'

import { Grid, Header, Form, Segment, Button, Icon, Message, Divider } from 'semantic-ui-react'
import request from 'superagent'
import logger from '../../utils/logger'
import viewParam from '../../utils/generalUtils'


@inject('routing')
@inject('auth')
@observer
export default class LoginForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggingInPorgress: false,
      loggingInFail: false,
      loginFailMessage: null,
    }
  }

  handleLogin(event){
    event.preventDefault()
    const { routing, location } = this.props
    const {email, password} = this.state
    const query = parse(location.search.substr(1))
    this.setState({
      loggingInPorgress: true,
      loggingInFail: false,
      loginFailMessage: null,
    })
    request.post('/login')
      .send({email, password})
      .accept('json')
      .type('json')
      .then((res) => {
        const {token, user} = res.body
        this.props.auth.user = user
        logger.setField({user:user.username, email:user.email})
        localStorage.setItem('jwt',token )

        this.setState({
          loggingInPorgress: false,
        })
        routing.replace(query.url||'/')
      }).catch((err)=>{
        console.error(err)
        let loginFailMessage = viewParam('response.body.error', err)
        if (!loginFailMessage){
          loginFailMessage='An unknown error occurred, please try again later'
        }
        this.setState({
          loggingInPorgress: false,
          loggingInFail:true,
          loginFailMessage,
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
      loggingInPorgress,
      loggingInFail,
      loginFailMessage,
    } = this.state

    return (
      <Form
          error={loggingInFail}
          loading={loggingInPorgress}
          onSubmit={::this.handleLogin}
      >
        <Header size="medium">Login</Header>
        <Form.Input
            focus
            label="Email"
            name="email"
            onChange={::this.handleInputChange}
            required
            type="email"
        />
        <Form.Input
            label="Password"
            name="password"
            onChange={::this.handleInputChange}
            required
            type="password"
        />
        <Button primary type="submit">Login</Button>

        <Divider horizontal>Or</Divider>

        <Form.Group inline>
          <Button color="facebook">
            <Icon name="facebook" /> Facebook
          </Button>
          <Button color="google plus">
            <Icon name="google" /> Google
          </Button>
        </Form.Group>

        <Message
            content={loginFailMessage}
            error
            header="Login Error!"
        />
      </Form>
    )
  }
}
