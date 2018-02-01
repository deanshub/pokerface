import React from 'react'

import classnames from 'classnames'
import style from './style.css'

export default ({bright, compact, small, large}) => {
  return (
    <div
        className={classnames(
          style.container,
          {[style.bright]:bright},
          {[style.fill]:!compact},
          {[style.small]:small},
          {[style.large]:large || !small},
        )}
    >
      <div className={classnames(style.point)}/>
      <div className={classnames(style.point)}/>
      <div className={classnames(style.point)}/>
    </div>
  )
}
