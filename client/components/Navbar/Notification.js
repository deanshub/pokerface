import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default ({number}) => {
  if (number===0){
    return null
  }

  const visulNumber = number<100?number:'+99'

  return (
    <span className={classnames(style.notification)}>
      {visulNumber}
    </span>
  )
}
