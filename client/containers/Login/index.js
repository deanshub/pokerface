// @flow

import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { parse } from 'qs'

import { Grid, Header, Form, Segment, Button, Icon, Divider, Message } from 'semantic-ui-react'
import request from 'superagent'
import R from 'ramda'
import Footer from './Footer'
import OpensourceModal from './OpensourceModal'

const viewParam = (path, obj) => {
  const lense = R.lensPath(path.split('.'))
  return R.view(lense, obj)
}

@inject('routing')
@inject('auth')
@observer
export default class Navigation extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggingInPorgress: false,
      loggingInFail: false,
      signingupInPorgress: false,
      signingupSuccess: false,
      loginFailMessage: null,
    }
  }

  handleLogin(event){
    event.preventDefault()
    const { routing, location } = this.props
    const {email, password} = this.state
    const query = parse(location.search.substr(1))
    this.setState({
      loggingInPorgress: true,
      loggingInFail: false,
      loginFailMessage: null,
    })
    request.post('/login')
      .send({email, password})
      .accept('json')
      .type('json')
      .then((res) => {
        const {token, user} = res.body
        this.props.auth.user= user
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
      }).accept('json')
      .type('json')
      .then(() => {
        this.setState({
          signingupInPorgress: false,
          signingupSuccess: true,
        })
      }).catch((err)=>{
        console.error(err)
        // let loginFailMessage = viewParam('response.body.error', err)
        // if (!loginFailMessage){
        //   loginFailMessage='An unknown error occurred, please try again later'
        // }
        this.setState({
          signingupInPorgress: false,
          signingupSuccess: true,
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
      signingupInPorgress,
      signingupSuccess,
      loggingInFail,
      loginFailMessage,
    } = this.state

    return (
      <Grid divided="vertically">
        <Grid.Row/>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header
                color="red"
                size="huge"
                textAlign="center"
            >
              <Header.Content>Pokerface.io</Header.Content>
              <Header.Subheader>Social platform for Poker players</Header.Subheader>
            </Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>

          <Grid.Column >
            <Segment basic padded>
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

                <Divider horizontal>Or</Divider>

                <Form.Group inline>
                  <Button color="facebook">
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
              </Form>
            </Segment>
          </Grid.Column>
          <Divider vertical>Or</Divider>
          <Grid.Column >
            <Segment basic padded>
              <Form
                  loading={signingupInPorgress}
                  onSubmit={::this.handleSignup}
                  success={signingupSuccess}
              >
                <Header size="medium">Sign-Up</Header>
                <Form.Input
                    label="First Name"
                    name="firstName"
                    onChange={::this.handleInputChange}
                    required
                />
                <Form.Input
                    label="Last Name"
                    name="lastName"
                    onChange={::this.handleInputChange}
                    required
                />
                <Form.Input
                    label="E-mail"
                    name="email"
                    onChange={::this.handleInputChange}
                    required
                    type="email"
                />
                <Button primary type="submit">Sign-Up</Button>

                  <Message
                      content="You're all signed up for Pokerface.io,  please check your email for further details"
                      header="Welcome!"
                      success
                  />
              </Form>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Footer/>
        <OpensourceModal/>
      </Grid>
    )
  }
}
