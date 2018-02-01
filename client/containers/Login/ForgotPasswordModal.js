import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import Modal, { ModalHeader, ModalContent, ModalFooter } from '../../components/basic/Modal'
import Button, {ButtonGroup} from '../../components/basic/Button'
import Input from '../../components/basic/Input'
import Message from '../../components/basic/Message'
import classnames from 'classnames'
import style from './style.css'

import request from 'superagent'
import {viewParam, isEmailPattern} from '../../utils/generalUtils'

export default class LoginForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      success:false,loading:false
    }
  }

  handleSending(){
    const {email} = this.state

    if (!isEmailPattern(email)){
      this.setState({error:true, errorMessage:'Invalid email'})
    }else{
      this.setState({loading:true})
      request.post('/api/forgotPassword').send({
        email,
      }).then(() => {
        this.setState({success:true,loading:false})
      }).catch((err) => {
        let errorMessage = viewParam('response.body.error', err)
        if (!errorMessage){
          errorMessage='An unknown error occurred, please try again later'
        }

        this.setState({error:true, errorMessage,loading:false})
      })
    }
  }

  handleInputChange(e, {name, value}){
    this.setState({
      [name]: value,
    })
  }


  onClose(){
    this.setState({success:false,error:false,loading:false})
    const {onClose} = this.props
    onClose()
  }
  render(){
    const {open} = this.props
    const {
      loading,
      success,
      error,
      errorMessage,
    } = this.state

    return (
      <Modal
          compact
          onClose={::this.onClose}
          open={open}
      >
        <ModalHeader>
          Reseting Password
        </ModalHeader>
        <ModalContent>
          {
            success?
              <div>
                Please check your email for further details
              </div>
            :
              <div className={classnames(style.forgotPasswordContent)}>
                <Input
                    focus
                    label="Email"
                    name="email"
                    onChange={::this.handleInputChange}
                    required
                    type="email"
                />
                <Message
                    error
                    hidden={!error}
                    message={errorMessage}
                />
            </div>
          }
        </ModalContent>
        <ModalFooter>
          <ButtonGroup
              horizontal
              noEqual
              reversed
          >
            {
              success?
                <Button onClick={::this.onClose} primary>OK</Button>
              :
              [
                <Button
                    loading={loading}
                    onClick={::this.handleSending}
                    primary
                >
                  Send
                </Button>,
                <Button onClick={::this.onClose}>Close</Button>,
              ]
            }
          </ButtonGroup>
        </ModalFooter>
      </Modal>)
  }
}
