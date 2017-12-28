import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Image extends Component {
  static defaultProps = {
    small: false,
  }

  render(){
    const {avatar, src, small} = this.props
    return(
      <img
          className={classnames(
            style.image,
            {[style.avatar]:avatar},
            {[style.small]:small},
          )}
          src={src}
      />
    )
  }
}
