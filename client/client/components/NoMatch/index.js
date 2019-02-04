// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'

export default class NoMatch extends Component {
  render() {
    return (
      <div className={classnames(style.content)}>
        <div className={classnames(style.white, style.h1)}>Page has been removed or is private...</div>
        <div className={classnames(style.white, style.h2)}>press on the house to go back to the home page</div>
        <a href="/">
          <div className={classnames(style.home)}/>
        </a>
      </div>
    )
  }
}