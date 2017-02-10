import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import classnames from 'classnames'
// import style from './style.css'
import { browserHistory } from 'react-router'
import { Grid, Header, Form, Segment, Button, Icon, Divider } from 'semantic-ui-react'

import * as LoginActions from '../../ducks/login'

class Navigation extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  }

  constructor(props){
    super(props)
    this.state = {
      loggingInPorgress: false,
      signingupInPorgress: false,
    }
  }

  handleLogin(){
    // const { actions2,actions, routing } = this.props
    this.setState({
      loggingInPorgress: true,
    })
    browserHistory.replace('/')

    // actions.login({
    //   user:this.userInput.value,
    //   password:this.passwordInput.value,
    // })
  }

  handleSignup(){
    this.setState({
      signingupInPorgress: true,
    })
  }

  render() {
    const {loggingInPorgress, signingupInPorgress} = this.state

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
              <Form loading={loggingInPorgress} onSubmit={::this.handleLogin}>
                <Header size="medium">Login</Header>
                <Form.Input focus label="Email" type="email"/>
                <Form.Input label="Password" type="password" />
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
              </Form>
            </Segment>
          </Grid.Column>
          <Divider vertical>Or</Divider>
          <Grid.Column >
            <Segment basic padded>
              <Form loading={signingupInPorgress} onSubmit={::this.handleSignup}>
                <Header size="medium">Sign-Up</Header>
                <Form.Input label="First Name"/>
                <Form.Input label="Last Name"/>
                <Form.Input label="E-mail" type="email"/>
                <Button primary type="submit">Sign-Up</Button>
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
