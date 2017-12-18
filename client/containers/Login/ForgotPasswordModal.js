import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Button, Modal, Form, Message, Dimmer, Loader } from 'semantic-ui-react'
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
          closeOnDimmerClick={false}
          dimmer="inverted"
          onClose={::this.onClose}
          open={open}
          size="mini"
      >
        <Dimmer active={loading} inverted>
          <Loader content="Loading" inverted/>
        </Dimmer>
        <Modal.Header>
          Reseting Password
        </Modal.Header>
        <Modal.Content>
          {
            success?
              'Please check your email for further details'
            :
              <Form
                  error={error}
              >
                <Form.Input
                    focus
                    label="Email"
                    name="email"
                    onChange={::this.handleInputChange}
                    required
                    type="email"
                />
                <Message
                    error
                    header={errorMessage}
                />
            </Form>
          }
        </Modal.Content>
          {
            success?
              <Modal.Actions>
                <Button onClick={::this.onClose} primary>OK</Button>
              </Modal.Actions>
            :
              <Modal.Actions>
                <Button onClick={::this.onClose}>Close</Button>
                <Button onClick={::this.handleSending} primary>Send</Button>
              </Modal.Actions>
          }
      </Modal>)
  }
}
