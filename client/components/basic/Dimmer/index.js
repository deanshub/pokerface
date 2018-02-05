import React from 'react'
import Loader from '../Loader'
import classnames from 'classnames'
import style from './style.css'

export default ({busy, children, className, label}) => {
  return (
    <div className={classnames(style.container, className)}>
      {children}
      {busy && <div className={classnames(style.overlay)}>
        <Loader>{label}</Loader>
      </div>}
    </div>
  )
}
