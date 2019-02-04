import React from 'react'
import landingLogo from '../../assets/standalone logo.png'
import classnames from 'classnames'
import style from './style.css'
import ResponsiveText from '../basic/ResponsiveText'

export default ({theme}) => (
  <div className={classnames(style.header, style[theme])}>
    <div className={classnames(style.firstRow)}>
      <img src={landingLogo}/>
      <ResponsiveText className={classnames(style.title)} scale={0.55}>
        Pokerface.io
      </ResponsiveText>
    </div>
    <ResponsiveText className={classnames(style.secondRow)} scale={0.277}>
      The Poker Community
    </ResponsiveText>
  </div>
)
