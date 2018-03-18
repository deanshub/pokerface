import React, { Component } from 'react'
import Loader from '../Loader'
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
      smallIcon,
      stretch,
      loading,
      className,
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
            {[style.stretch]: stretch},
            className,
          )}
          disabled={loading}
          href={href}
          onClick={(e)=>onClick(e, e.target)}
          {...restProps}
      >
        <span className={classnames(style.content)}>
          {leftIcon&&
            <div
                className={classnames(
                  style.leftIcon,
                  {[style.smallIcon]:smallIcon},
                  style[leftIcon],
                )}
            />
          }
          {loading?
            <Loader bright={primary} small/>
          :
            children
          }
        </span>
      </ContainerElement>
    )
  }
}

export class ButtonGroup extends Component {
  render(){
    const {horizontal, children, center, noEqual, reversed, wrapReverse, ...restProps} = this.props
    return(
      <div
          className={classnames(
            style.buttonGroup,
            {[style.horizontal]:horizontal},
            {[style.noEqual]:noEqual},
            {[style.reversed]:reversed},
            {[style.center]:center},
            {[style.wrapReverse]: wrapReverse},
          )}
          {...restProps}
      >
        {children}
      </div>
    )
  }
}
