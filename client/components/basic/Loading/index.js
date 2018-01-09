import React from 'react'
import classnames from 'classnames'
import style from './style.css'

export default ()=>{
  return (
    <div className={classnames(style.loading)}>
      Loading...
    </div>
  )
}
