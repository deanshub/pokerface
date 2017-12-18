// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import { Header, Icon } from 'semantic-ui-react'
import classnames from 'classnames'

import PublicPageTemplate from '../../components/PublicPageTemplate'
import style from './style.css'

export default class SettingPassword extends Component {
  render() {
    return (
      <PublicPageTemplate horizontal>
        <div className={classnames(style.content)}>
          <Header size="huge">Page has been removed or is private...</Header>
          <Header>press on the house to go back home</Header>
          <a href="/">
            <Icon
                color="red"
                link
                name="home"
                size="massive"
            />
          </a>
        </div>
      </PublicPageTemplate>
    )
  }
}
