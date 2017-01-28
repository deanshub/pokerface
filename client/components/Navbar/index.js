import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import style from './style.css'

export default class Navbar extends Component {
  render() {
    return (
      <div className={classnames(style.container)}>
        <Link className={classnames(style.link)} to="/">feed</Link>
        <Link className={classnames(style.link)} to="/profile">profile</Link>
        <Link className={classnames(style.link)} to="/login">sign out</Link>
      </div>
    )
  }
}
