// @flow
import React, { Component, PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import DevTools from 'mobx-react-devtools'
import Navbar from '../../components/Navbar'
import 'semantic-ui-css/semantic.min.css'
import classnames from 'classnames'
import style from './style.css'

export default class Navigation extends Component {
  static propTypes={
    children: PropTypes.element,
  }

  render() {
    // const { board, actions, children } = this.props
    const { children } = this.props

    return (
      <DocumentTitle title="Pokerface.io">
        <div>
          {
            process.env.NODE_ENV==='development'?<DevTools/>:null
          }
          <Navbar />
          <div className={classnames(style.container)} style={{paddingTop: 51}}>
            {children}
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
