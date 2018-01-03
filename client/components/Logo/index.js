import React from 'react'
import landingLogo from '../../assets/standalone logo.png'
import classnames from 'classnames'
import style from './style.css'

export default () => (
  <div className={classnames(style.header)}>
    <div className={classnames(style.firstRow)}>
      <img src={landingLogo}/>
      <div  className={classnames(style.title)}>
        Pokerface.io
      </div>
    </div>
    <div className={classnames(style.secondRow)}>
      The Poker Cmmunity
    </div>
  </div>
)
