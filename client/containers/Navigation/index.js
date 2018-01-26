// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import DevTools from 'mobx-react-devtools'
import Navbar from '../../components/Navbar'
import TopMenu from './TopMenu'
import Content from './Content'


import classnames from 'classnames'
import style from './style.css'
import image from '../../assets/landing logo.png'

export default class Navigation extends Component {
  static propTypes={
    children: PropTypes.element,
  }

  render() {
    return (
      <DocumentTitle title="Pokerface.io">
        <div>
          {
            process.env.NODE_ENV==='development'?<DevTools/>:null
          }
          <div className={classnames(style.header)}>
            <div className={classnames(style.title)}>
              <img className={classnames(style.titleImg)} src={image}/>
              <div>
                Pokerface.io
              </div>
            </div>
            <TopMenu/>
          </div>
          <div className={classnames(style.container)}>
            <div className={classnames(style.navbar)}>
              <Navbar/>
            </div>
            <Content/>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
