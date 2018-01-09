import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Button extends Component {
  static defaultProps = {
    onClick:()=>{},
  }

  render(){
    const {
      children,
      simple,
      active,
      onClick,
      hidden,
      primary,
      href,
      leftIcon,
      disable,
      small,
      ...restProps
    } = this.props

    const ContainerElement = href?'a':'button'

    return(
      <ContainerElement
          className={classnames(
            style.button,
            {[style.active]: active},
            {[style.primary]: primary},
            {[style.disable]: disable},
            {[style.simple]: simple},
            {[style.hidden]: hidden},
            {[style.small]: small},
          )}
          href={href}
          onClick={(e)=>onClick(e, e.target)}
          {...restProps}
      >
        {leftIcon&&
          <div
              className={classnames(
                style.leftIcon,
                style[leftIcon],
              )}
          />
        }
        {children}
      </ContainerElement>
    )
  }
}

export class ButtonGroup extends Component {
  render(){
    const {horizontal, children, noEqual, ...restProps} = this.props
    return(
      <div
          className={classnames(
            style.buttonGroup,
            {[style.horizontal]:horizontal},
            {[style.noEqual]:noEqual},
          )}
          {...restProps}
      >
        {children}
      </div>
    )
  }
}
