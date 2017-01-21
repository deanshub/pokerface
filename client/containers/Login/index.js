import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import style from './style.css'
import { browserHistory } from 'react-router'

import * as LoginActions from '../../ducks/login'

class Navigation extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  }

  constructor(props){
    super(props)
    this.state = {
      loggingInPorgress: false,
    }
  }

  handleLogin(){
    const { actions2,actions, routing } = this.props
    this.setState({
      loggingInPorgress: true,
    })
    browserHistory.replace('/')

    // actions.login({
    //   user:this.userInput.value,
    //   password:this.passwordInput.value,
    // })
  }

  render() {
    const {loggingInPorgress} = this.state

    return (
      <div className={classnames(style.container)}>
        <div>login page</div>
        <div className={classnames(style.inputGroup)}>
          <div>Username:</div>
          <input ref={e=>this.userInput = e} />
        </div>
        <div className={classnames(style.inputGroup)}>
          <div>Password:</div>
          <input ref={e=>this.passwordInput = e} type="password" />
        </div>
        <button onClick={::this.handleLogin}>Login</button>
        {loggingInPorgress&&<div>Loading...</div>}
      </div>
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
