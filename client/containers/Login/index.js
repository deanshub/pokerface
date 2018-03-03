// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
// import PropTypes from 'prop-types'
import logger from '../../utils/logger'
import request from 'superagent'
import {viewParam} from '../../utils/generalUtils'
import Button, {ButtonGroup} from '../../components/basic/Button'
import Input from '../../components/basic/Input'
import Message from '../../components/basic/Message'
import IsMobile from '../../components/IsMobile'
import Logo from '../../components/Logo'
import LoginForm from './LoginForm'
import landingLogo from '../../assets/landing logo.png'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@observer
export default class Login extends Component {
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
        logger.logEvent({category:'User',action:'Sign-Up', value:email})
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

  getSignupForm(isMobile){
    const {
      signingupSuccess,
      signingupInFail,
      signingupInPorgress,
      signingupFailMessage,
    } = this.state

    return (
      <form
          className={classnames(style.rightMain)}
          onSubmit={::this.handleSignup}
      >
        <div className={classnames(
          style.formDescription,
          style.uppercase,
          {[style.mobileDesc]:isMobile},
        )}
        >
          Enter Your Name and Email
        </div>
        <ButtonGroup horizontal>
          <Input
              name="firstName"
              onChange={::this.handleInputChange}
              placeholder="First Name"
          />
          <Input
              name="lastName"
              onChange={::this.handleInputChange}
              placeholder="Last Name"
          />
        </ButtonGroup>
        <Input
            name="email"
            onChange={::this.handleInputChange}
            placeholder="Email"
        />
        <Button
            className={style.signupButton}
            loading={signingupInPorgress}
            primary
            stretch
            type="submit"
        >
          Create Account
        </Button>
        {
          signingupSuccess&&
          <Message message="Account created successfully. Check your email." success/>
        }
        {
          signingupInFail&&
          <Message error message={signingupFailMessage}/>
        }

        <div className={classnames(
          style.formDescription,
          style.uppercase,
          {[style.mobileDesc]:isMobile},
        )}
        >
          Or Sign Up Using
        </div>
        <ButtonGroup horizontal>
          <a
              className={classnames(style.link)}
              href="/login/facebook"
              style={{background:'linear-gradient(106deg, #6482b3, #3c5896)'}}
          >
            Facebook
          </a>
          <a
              className={classnames(style.link)}
              href="/login/googleplus"
              style={{background:'linear-gradient(106deg, #dc7869, #dc4e40)'}}
          >
            Google
          </a>
        </ButtonGroup>
        <div className={classnames(style.terms)}>
          By signing up, I agree to Pokerface.io's <span style={{color:'#25aae1'}}>Terms of Service</span> and <span style={{color:'#25aae1'}}>Privacy Policy</span>.
        </div>
      </form>
    )
  }


  getDescription(isMobile){
    return (
      isMobile?
        <div className={classnames(style.leftMain)}>
          <Logo/>
        </div>
      :
        <div className={classnames(style.leftMain)}>
          <img src={landingLogo} />
          <div className={classnames(style.line)}/>
          <div className={classnames(style.smallHeader)}>
            pokerface.io
          </div>
          <div className={classnames(style.sectionHeader)}>
            The Poker Community
          </div>
          <div className={classnames(style.sectionDescription)}>
            Learn
            <div className={classnames(style.divider)}/>
            Share
            <div className={classnames(style.divider)}/>
            Win
          </div>
        </div>
    )
  }

  render(){

    return(
      <div className={classnames(style.landing)}>
        <div className={classnames(style.sectionOne)}>
          <div className={classnames(style.header)}>
            <div className={classnames(style.title)}>
                Pokerface.io
            </div>
            <IsMobile
                render={(isMobile) => {
                  return (
                    isMobile?
                      <Button className={style.mobileShowLoginButton}>
                        Login
                      </Button>
                    :
                      <LoginForm/>
                  )
                }}
            />
          </div>
          <IsMobile render={(isMobile) => {
            return (
              <div className={classnames(style.mainContent,{[style.mobileMainContent]:isMobile})}>
                {this.getDescription(isMobile)}
                {this.getSignupForm(isMobile)}
              </div>
            )
          }}
          />
        </div>

      </div>
    )
  }
}
