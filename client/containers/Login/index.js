// @flow

import React, { Component, PropTypes } from 'react'
// import { observer, inject } from 'mobx-react'
// import { Grid, Header, Form, Segment, Button, Icon, Divider, Message } from 'semantic-ui-react'
import { Segment } from 'semantic-ui-react'
// import request from 'superagent'
// import R from 'ramda'
// import logger from '../../utils/logger'
import PublicPageTemplate from '../../components/PublicPageTemplate'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'

export default () => (
  <PublicPageTemplate horizontal>
      <Segment basic>
        <LoginForm/>
      </Segment>
      <Segment basic>
        <SignupForm/>
      </Segment>
  </PublicPageTemplate>
)
