// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Input from '../../components/basic/Input'
import Button from '../../components/basic/Button'
import Message from '../../components/basic/Message'
import request from 'superagent'
import logger from '../../utils/logger'
import PublicPageTemplate from '../../components/PublicPageTemplate'
import {viewParam} from '../../utils/generalUtils'
import classnames from 'classnames'
import style from './style.css'

@inject('routing')
@inject('auth')
@observer
export default class SettingPassword extends Component {
  constructor(props){
    super(props)
    this.state = {
      settingChecking: false,
      clientError: false,
      errorMessage: null,
      settingFailed: false,
      settingSuccesseded: false,
    }
  }

  handleSettingPassowrd(e){
    e.preventDefault()

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

  signUpRedirect(e){
    e.preventDefault()

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
      this.setState({clientError:true, errorMessage})
      return false
    }
    return true
  }

  render() {
    const {
      settingChecking,
      clientError,
      errorMessage,
      settingFailed,
    } = this.state

    return (
      <PublicPageTemplate horizontal>
        {
          settingFailed?
            <form className={classnames(style.failureContent)} onSubmit={::this.signUpRedirect}>
              <div className={classnames(style.failureHeader)}>
                The setting password failed.
              </div>
              <div className={classnames(style.failureExplanation)}>
               The Registration might expired. <br/> Check your email for another messages or
               try to sign up again:
              </div>
              <Button
                  primary
                  stretch
                  type="submit"
              >
                Sign-up
              </Button>
            </form>
          :
            <form className={classnames(style.form)} onSubmit={::this.handleSettingPassowrd}>
              <div className={classnames(style.header)} size="medium">
                Setting Password
              </div>
              <Input
                  focus
                  name="password"
                  onChange={::this.handleInputChange}
                  placeholder="password"
                  type="password"
              />
              <Input
                  name="confirmPassword"
                  onChange={::this.handleInputChange}
                  placeholder="confirm password"
                  type="password"
              />
              <div className={classnames(style.buttonContainer)}>
                <Button
                    loading={settingChecking}
                    primary
                    stretch
                    type="submit"
                >
                    Set password
                </Button>
              </div>
              <Message
                  displayNone={!clientError}
                  error
                  message={errorMessage}
              />
            </form>
        }
    </PublicPageTemplate>
    )
  }
}
