import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import classnames from 'classnames'
// import style from './style.css'
import { browserHistory } from 'react-router'
import { Grid, Header, Form, Segment, Button, Icon, Divider, Message } from 'semantic-ui-react'
import request from 'superagent'
import R from 'ramda'
import * as LoginActions from '../../ducks/login'

const viewParam = (path, obj) => {
  const lense = R.lensPath(path.split('.'))
  return R.view(lense, obj)
}

class Navigation extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  }

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

  handleLogin(event, {formData}){
    event.preventDefault()
    // const { actions2,actions, routing } = this.props
    this.setState({
      loggingInPorgress: true,
      loggingInFail: false,
      loginFailMessage: null,
    })
    request.post('/login')
      .send({email:formData.email, password:formData.password})
      .accept('json')
      .type('json')
      .then(() => {
        this.setState({
          loggingInPorgress: false,
        })
        browserHistory.replace('/')
      }).catch((err)=>{
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

    // actions.login({
    //   user:this.userInput.value,
    //   password:this.passwordInput.value,
    // })
  }

  handleSignup(event, {formData}){
    event.preventDefault()
    this.setState({
      signingupInPorgress: true,
    })

    request.post('/api/signup')
      .send({
        firstName:formData.firstName,
        lastName:formData.lastName,
        email:formData.email,
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
                    required
                    type="email"
                />
                <Form.Input
                    label="Password"
                    name="password"
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
                    required
                />
                <Form.Input
                    label="Last Name"
                    name="lastName"
                    required
                />
                <Form.Input
                    label="E-mail"
                    name="email"
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
      </Grid>

    )
  }
}

function mapStateToProps(state) {
  return {
    // routing: state.routing,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(LoginActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation)
