import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'

@inject('routing')
@observer
export default class Image extends Component {
  static defaultProps = {
    small: false,
  }

  reRoute(){
    const{routing, href} = this.props
    routing.push(href)
  }

  render(){
    const {
      avatar,
      src,
      small,
      big,
      className,
      href,
      onClick,
      ...restProps
    } = this.props
    return(
      <img
          className={classnames(
            style.image,
            {[style.avatar]:avatar},
            {[style.small]:small},
            {[style.big]:big},
            {[style.link]:(href&&href!=='')||onClick},
            className,
          )}

          onClick={onClick||::this.reRoute}
          src={src}
          {...restProps}
      />
    )
  }
}
