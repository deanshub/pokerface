import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { parse } from 'qs'
import request from 'superagent'
import logger from '../../utils/logger'
import {viewParam} from '../../utils/generalUtils'
import Button, {ButtonGroup} from '../../components/basic/Button'
import Input from '../../components/basic/Input'
import Message from '../../components/basic/Message'
import ForgotPasswordModal from './ForgotPasswordModal'
import SelectUserModal from '../SelectUserModal'
import classnames from 'classnames'
import style from './style.css'

@inject('routing')
@inject('auth')
@observer
export default class LoginForm extends Component{

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

  handleInputChange(e, {name, value}){
    this.setState({
      [name]: value,
    })
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

  render(){
    const {
      loggingInPorgress,
      loggingInFail,
      loginFailMessage,
      forgotPasswordModalOpen,
      selectUserModalOpen,
      redirectUrl,
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
