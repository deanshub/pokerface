// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'
import Footer from '../../containers/PublicPageFooter'
import Logo from '../Logo'

export default class PublicPageTemplate extends Component {

  render() {
    const { children, horizontal, loading } = this.props

    return (
      <div className={classnames(style.container)}>
        <div>
          <Logo/>
        </div>
        <div className={classnames(style.content)}>
            {
              (Array.isArray(children) && horizontal)?
                children.map((child, index) => <div key={index}>{child}</div>)
              :
                children
            }
        </div>
        <Footer/>
      </div>
    )
  }
}
