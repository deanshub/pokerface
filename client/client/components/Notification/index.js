import React from 'react'
import classnames from 'classnames'
import style from './style.css'

export default ({
  className,
  label,
  onClick,
  number,
}) => {
  if (number===0){
    return null
  }

  const visulLabel = Number.isInteger(number)?
      number<100?number:'+99'
    :
      number

  return (
    <span className={classnames(style.notification, {[style.clickable]:onClick},className)} onClick={onClick}>
      {label? `${visulLabel} ${label}`: visulLabel}
    </span>
  )
}
