import React from 'react'
import SearchBar from '../SearchBar'
import classnames from 'classnames'
import style from './style.css'

export default ({onClose, open}) => {
  return (
    <div className={classnames(style.mobileSearchBar, {[style.closed]:!open})}>
      <SearchBar onItemSelect={onClose}/>
      <div className={classnames(style.back)} onClick={onClose}/>
    </div>
  )
}
