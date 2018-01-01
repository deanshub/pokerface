// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import request from 'superagent'
// import logger from '../../utils/logger'
import classnames from 'classnames'
import style from './style.css'

// TODO: remove loginForm and signUpForm components when done
export default class Login extends Component {
  render(){
    return(
      <div className={classnames(style.landing)}>
        <div className={classnames(style.sectionOne)}>
          <div className={classnames(style.header)}>
            <div className={classnames(style.title)}>
              Pokerface.io
            </div>
            <div className={classnames(style.login)}>
              Already have an account?
            </div>
          </div>

          <div className={classnames(style.mainContent)}>
            <div className={classnames(style.leftMain)}>
              pokerface
            </div>
            <div className={classnames(style.rightMain)}>
              login
            </div>
          </div>
        </div>
      </div>
    )
  }
}
