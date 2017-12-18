// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

import { Grid, Header, Form, Container, Button, Message, Modal } from 'semantic-ui-react'
import request from 'superagent'
import logger from '../../utils/logger'
import PublicPageTemplate from '../../components/PublicPageTemplate'
import {viewParam} from '../../utils/generalUtils'

@inject('routing')
@inject('auth')
@observer
export default class SettingPassword extends Component {
  constructor(props){
    super(props)
    this.state = {
      settingChecking: false,
      undeterminedError: false,
      errorMessage: null,
      settingFailed: false,
      settingSuccesseded: false,
    }
  }

  handleSettingPassowrd(){

    if (this.passwordClientCheck()){
      const { routing , match:{params:{uuid}} } = this.props
      const {password} = this.state

      this.setState({settingChecking:true})

      request.post('/api/setPassword').send({
        uuid,
        password,
      }).then((res) => {
        const {success, token, email} = res.body

        if (success) {
          logger.logEvent({category:'User',action:'Reset password', value:email})
          localStorage.setItem('jwt',token )
          routing.push('/')
        }else{
          this.setState({settingFailed:true})
        }

      }).catch((err) => {
        let errorMessage = viewParam('response.body.error', err)
        if (!errorMessage){
          errorMessage='An unknown error occurred, please try again later'
        }

        this.setState({settingChecking:false, undeterminedError:true, errorMessage})
      })
    }
  }

  handleInputChange(e, {name, value}){
    this.setState({
      [name]: value,
    })
  }

  signUpRedirect(){
    const { routing } = this.props
    routing.push('/login') // TODO change to replace on it will work
  }

  passwordClientCheck(){
    const {password, confirmPassword} = this.state
    let errorMessage

    if (password !== confirmPassword){
      errorMessage = 'Passwords are not equal.'
    }else if (password.length < 6){
      errorMessage = 'Your password must be at least 6 characters long.'
    }

    if (errorMessage){
      this.setState({undeterminedError:true, errorMessage})
      return false
    }
    return true
  }

  render() {
    const {
      settingChecking,
      undeterminedError,
      errorMessage,
      settingFailed,
    } = this.state


    return (
      <PublicPageTemplate horizontal>
        <Grid stretched verticalAlign="middle">
          <Grid.Row centered stretched>
            <Grid.Column width={4}>
              {
                settingFailed?
                  <Container>
                    <Header size="large">
                      The setting password failed.
                    </Header>
                    <Header size="medium">
                     The Registration might expired. <br/> Check your email for another messages or
                     try to sign up again:
                    </Header>
                    <Button onClick={::this.signUpRedirect} primary>Sign-up</Button>
                  </Container>
                :
                  <Form
                      error={undeterminedError}
                      loading={settingChecking}
                      onSubmit={::this.handleSettingPassowrd}
                  >
                    <Header size="medium">Setting Password</Header>
                    <Form.Input
                        focus
                        label="Password"
                        name="password"
                        onChange={::this.handleInputChange}
                        placeholder="password"
                        required
                        type="password"
                    />
                    <Form.Input
                        label="Confirm Password"
                        name="confirmPassword"
                        onChange={::this.handleInputChange}
                        placeholder="confirm password"
                        required
                        type="password"
                    />
                    <Button primary type="submit">Set password</Button>
                    <Message
                        content={errorMessage}
                        error
                        header="Setting password error!"
                    />
                  </Form>
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
    </PublicPageTemplate>
    )
  }
}
