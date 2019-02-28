import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import request from 'superagent'
import logger from '../../utils/logger'
import {viewParam} from '../../utils/generalUtils'
import Button, {ButtonGroup} from '../../components/basic/Button'
import Input from '../../components/basic/Input'
import Message from '../../components/basic/Message'
import ForgotPasswordModal from './ForgotPasswordModal'
import classnames from 'classnames'
import style from './style.css'
import { parse } from 'qs'

@inject('auth')
@inject('routing')
@observer
class LoginForm extends Component{

  constructor(props){
    super(props)

    this.state = {
      loggingInPorgress: false,
      loggingInFail: false,
      loginFailMessage: null,
      forgotPasswordModalOpen: false,
    }
  }

  handleInputChange(e, {name, value}){
    this.setState({
      [name]: value,
    })
  }

  handleLogin(event){
    event.preventDefault()
    const { routing, openSelectUserModal } = this.props
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
          })
          openSelectUserModal()
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

  render(){
    const {
      loggingInPorgress,
      loggingInFail,
      loginFailMessage,
      forgotPasswordModalOpen,
      email,
    } = this.state

    const {isMobile} = this.props

    return (
      <div className={classnames(style.login)}>
          <form
              className={classnames(style.loginForm ,{[style.mobileLoginForm]:isMobile})}
              onSubmit={::this.handleLogin}
          >
            {isMobile && <div className={classnames(
              style.formDescription,
              style.uppercase,
              {[style.mobileDesc]:isMobile},
            )}
            >
              Enter Email And Password
            </div>}
            <Input
                name="email"
                onChange={::this.handleInputChange}
                padded
                placeholder="Email"
                value={email}
            />
            <Input
                name="password"
                onChange={::this.handleInputChange}
                padded
                placeholder="Password"
                type="password"
            />
            <Button
                className={style.signupButton}
                loading={loggingInPorgress}
                stretch={isMobile}
                primary
                type="submit"
            >
              Login
            </Button>
            {
              loggingInFail && !isMobile &&
              <Message
                  className={style.loginMessage}
                  error
                  message={loginFailMessage}
              />
            }
            <a
                className={classnames(style.forgotPassword)}
                onClick={() => this.setState({forgotPasswordModalOpen:true})}
            >
              Forgot password?
            </a>
          </form>
          {
            loggingInFail && isMobile &&
            <Message
                error
                message={loginFailMessage}
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

export default LoginForm
