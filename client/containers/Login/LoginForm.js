// @flow

import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { parse } from 'qs'
import ForgotPasswordModal from './ForgotPasswordModal'
import { Header, Form, Button, Icon, Message, Divider } from 'semantic-ui-react'
import request from 'superagent'
import logger from '../../utils/logger'
import {viewParam} from '../../utils/generalUtils'
import classnames from 'classnames'
import style from './style.css'

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
      forgotPasswordModalOpen: false,
    }
  }

  handleLogin(event){
    event.preventDefault()
    const { routing } = this.props
    const {email, password} = this.state
    const query = parse(routing.location.search.substr(1))
    this.setState({
      loggingInPorgress: true,
      loggingInFail: false,
      loginFailMessage: null,
    })
    request.post('/login/local')
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
      forgotPasswordModalOpen,
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
        <a
            className={classnames(style.forgotPassord)}
            onClick={() => this.setState({forgotPasswordModalOpen:true})}
        >
          Forgot password?
        </a>

        <Divider horizontal>Or</Divider>

        <Form.Group inline>
          <Button as="a" color="facebook" href="/login/facebook">
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
        <ForgotPasswordModal
            onClose={() => this.setState({forgotPasswordModalOpen:false})}
            open={forgotPasswordModalOpen}
        />
      </Form>
    )
  }
}
