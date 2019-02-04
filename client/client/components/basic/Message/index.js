import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default ({className, message, error, success, hidden, displayNone}) => {

  return (
    <div className={
        classnames(
          style.label,
          {[style.error]:error},
          {[style.success]:success},
          {[style.hidden]:hidden},
          {[style.displayNone]:displayNone},
          className,
        )
      }
    >
      {message}
    </div>
  )

}
