// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import ResponsiveContainer from '../../components/ResponsiveContainer'
import classnames from 'classnames'
import style from './style.css'
import OpensourceModal from '../OpensourceModal'

@inject('auth')
@observer
export default class Footer extends Component {
  render() {
    const {auth} = this.props

    return (
      <ResponsiveContainer
          desktopClassName={classnames(style.container)}
          mobileClassName={classnames(style.mobileContainer)}
      >
        <div>
          Ⓒ Pokerface.io
        </div>
        <div className={classnames(style.divider)}/>
        <div>
          We support Open Source!
        </div>
        <div className={classnames(style.divider)}/>
        <div>
          <a href="#" onClick={()=>{auth.opensourceModalOpen=true}}>Here</a>'s a List of opensource software that we use
        </div>
        <div className={classnames(style.divider)}/>
        <div>
          Get in touch at <a href="mailto:support@pokerface.io?subject=Pokerface I have a suggestion&body=Hi Pokerface, I enjoy you very much, ">Support@pokerface.io</a>
        </div>
        <OpensourceModal/>
      </ResponsiveContainer>
    )
  }
}
