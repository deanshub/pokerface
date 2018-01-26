// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import DevTools from 'mobx-react-devtools'
import Navbar from '../../../components/Navbar/Mobile'
import Content from '../Content'


import classnames from 'classnames'
import style from './style.css'
import menu from '../../../assets/mobile/menu-mobile@2x.png'
import logo from '../../../assets/mobile/logo-mobile@2x.png'
import search from '../../../assets/mobile/search@2x.png'

export default class MobileNavigation extends Component {
  static propTypes={
    children: PropTypes.element,
  }

  constructor(props){
    super(props)
    this.state = {navbarOpen:false}
  }

  onCloseNavbar(){
    this.setState({navbarOpen:false})
  }

  openNavbar(){
    this.setState({navbarOpen:true})
  }

  render() {
    const {navbarOpen} = this.state

    return (
      <DocumentTitle title="Pokerface.io">
        <div>
          {
            process.env.NODE_ENV==='development'?<DevTools/>:null
          }
          <div className={classnames(style.header)}>
            <img
                className={classnames(style.menu)}
                onClick={::this.openNavbar}
                src={menu}
            />
            <img className={classnames(style.logo)} src={logo}/>
            <img className={classnames(style.search)} src={search}/>
          </div>
          <div className={classnames(style.container)}>
            <Content/>
          </div>
          <Navbar onClose={::this.onCloseNavbar} open={navbarOpen}/>
        </div>
      </DocumentTitle>
    )
  }
}
