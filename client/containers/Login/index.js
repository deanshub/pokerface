// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { parse } from 'qs'
// import PropTypes from 'prop-types'
import logger from '../../utils/logger'
import request from 'superagent'
import {viewParam} from '../../utils/generalUtils'
import Button, {ButtonGroup} from '../../components/basic/Button'
import Input from '../../components/basic/Input'
import DropDown from '../../components/basic/DropDown'
import landingLogo from '../../assets/landing logo.png'
import classnames from 'classnames'
import style from './style.css'
import SelectUserModal from '../SelectUserModal'
import ForgotPasswordModal from './ForgotPasswordModal'

@inject('routing')
@inject('auth')
@observer
export default class Login extends Component {
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
      signingupInPorgress: false,
      signingupSuccess: false,
      signingupInFail: false,
      signingupFailMessage: null,
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

  onCloseSelectUserModal(){
    this.setState({selectUserModalOpen:false})
    this.props.auth.logout()
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

  render(){
    const {
      loggingInPorgress,
      loggingInFail,
      loginFailMessage,
      forgotPasswordModalOpen,
      selectUserModalOpen,
      redirectUrl,
      email,
      signingupSuccess,
      signingupInFail,
      signingupFailMessage,
    } = this.state

    return(
      <div className={classnames(style.landing)}>
        <div className={classnames(style.sectionOne)}>
          <div className={classnames(style.header)}>
            <div className={classnames(style.title)}>
              Pokerface.io
            </div>
            <div className={classnames(style.login)}>
              Already have an account?
              <DropDown
                  trigger={
                    <Button small style={{padding:'0.5em 3em', marginLeft: '2em'}}>Login</Button>
                  }
              >
                <form className={classnames(style.loginDropdown)} onSubmit={::this.handleLogin}>
                  <Input
                      name="email"
                      onChange={::this.handleInputChange}
                      placeholder="Email"
                      value={email}
                  />
                  <Input
                      name="password"
                      onChange={::this.handleInputChange}
                      placeholder="Password"
                      type="password"
                  />
                  <a
                      onClick={() => this.setState({forgotPasswordModalOpen:true})}
                      style={{color:'#25aae1', textTransform:'none'}}
                  >
                    Forgot password?
                  </a>
                  <Button
                      primary
                      type="submit"
                  >
                    Login
                  </Button>
                  {
                    loggingInFail&&
                    <div className={classnames(style.label,style.error)} style={{marginTop:'2em'}}>
                      {loginFailMessage}
                    </div>
                  }
                </form>
              </DropDown>
            </div>
          </div>

          <div className={classnames(style.mainContent)}>
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
                Share
                <div className={classnames(style.divider)}/>
                Learn
                <div className={classnames(style.divider)}/>
                Win
              </div>
            </div>

            <form
                className={classnames(style.rightMain)}
                onSubmit={::this.handleSignup}
                style={{marginTop:70}}
            >
              <div className={classnames(style.uppercase)} style={{marginLeft:'2em', marginBottom:'1em'}}>
                Enter Your Name and Email
              </div>
              <ButtonGroup horizontal>
                <Input
                    name="firstName"
                    onChange={::this.handleInputChange}
                    placeholder="First Name"
                    style={{padding:'1.1em'}}
                />
                <Input
                    name="lastName"
                    onChange={::this.handleInputChange}
                    placeholder="Last Name"
                    style={{padding:'1.1em'}}
                />
              </ButtonGroup>
              <Input
                  name="email"
                  onChange={::this.handleInputChange}
                  placeholder="Email"
                  style={{padding:'0.7em'}}
              />
              <Button
                  primary
                  style={{width: '98%', margin: '1em auto', textTransform: 'uppercase'}}
                  type="submit"
              >
                Create Account
              </Button>
              {
                signingupSuccess&&
                <div className={classnames(style.label,style.success)}>
                  <div>Account created successfully.</div>
                  <div>Check your email.</div>
                </div>
              }
              {
                signingupInFail&&
                <div className={classnames(style.label,style.error)}>
                  {signingupFailMessage}
                </div>
              }

              <div className={classnames(style.uppercase)} style={{marginLeft:'2em', marginTop:'4em', marginBottom:'1em'}}>
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
              <div style={{marginTop:'1em', marginLeft:'2em'}}>
                By signing up, I agree to Pokerface.io's <span style={{color:'#25aae1'}}>Terms of Service</span> and <span style={{color:'#25aae1'}}>Privacy Policy</span>.
              </div>
            </form>
          </div>
        </div>
        {
          selectUserModalOpen &&
          <SelectUserModal
              login
              onClose={::this.onCloseSelectUserModal}
              open={selectUserModalOpen}
              redirectUrl={redirectUrl}
          />
        }
        <ForgotPasswordModal
            onClose={() => this.setState({forgotPasswordModalOpen:false})}
            open={forgotPasswordModalOpen}
        />
      </div>
    )
  }
}
