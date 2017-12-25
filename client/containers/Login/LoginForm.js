// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { parse } from 'qs'
import ForgotPasswordModal from './ForgotPasswordModal'
import { Header, Form, Button, Icon, Message, Divider } from 'semantic-ui-react'
import request from 'superagent'
// import logger from '../../utils/logger'
import {viewParam} from '../../utils/generalUtils'
import classnames from 'classnames'
import style from './style.css'
import SelectUserModal from '../SelectUserModal'

@inject('routing')
@inject('auth')
@observer
export default class LoginForm extends Component {
  constructor(props){
    super(props)
    const { routing } = this.props

    const query = parse(routing.location.search.substr(1))

    this.state = {
      loggingInPorgress: false,
      loggingInFail: false,
      loginFailMessage: null,
      forgotPasswordModalOpen: false,
      selectUserModalOpen: query.selectuser,
      redirectUrl: query.url || '/',
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
        // this.props.auth.user = user
        // logger.setField({user:user.username, email:user.email})
        localStorage.setItem('jwt',token )
        if (user.organizations > 0){
          this.setState({
            loggingInPorgress: false,
            selectUserModalOpen: true,
          })
        }else{
          // const {avatar, fullname, username, organizations} = user
          // const users = [{avatar, fullname, username}, ...organizations]
          routing.replace(query.url || '/')
        }

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

  onCloseSelectUserModal(){
    this.setState({selectUserModalOpen:false})
    this.props.auth.logout()
  }

  render() {
    const {
      loggingInPorgress,
      loggingInFail,
      loginFailMessage,
      forgotPasswordModalOpen,
      selectUserModalOpen,
      redirectUrl,
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

          <Button as="a" color="google plus" href="/login/googleplus">
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
        {
          selectUserModalOpen &&
          <SelectUserModal
              login
              onClose={::this.onCloseSelectUserModal}
              open={selectUserModalOpen}
              redirectUrl={redirectUrl}
          />
        }
      </Form>
    )
  }
}
