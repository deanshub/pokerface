// @flow
import React, { Component } from 'react'

import classnames from 'classnames'
import style from './style.css'


export default ({className, image, header} ) =>{
  return (
    <div className={classnames(style.card, className)}>
      <img src={image}/>
      <div>
        <div className={classnames(style.header)}>{header}</div>
      </div>
    </div>
  )
}
