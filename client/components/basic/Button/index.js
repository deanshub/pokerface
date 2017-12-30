import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Button extends Component {
  render(){
    const { text, active, onClick, name, primary, leftIcon, disable } = this.props
    return(
      <button
          className={classnames(
            style.button,
            style[name],
            {[style.active]: active},
            {[style.primary]: primary},
            {[style.disable]: disable},
          )}
          onClick={(e)=>onClick(e, e.target)}
      >
        {leftIcon&&
          <div className={classnames(style.leftIcon,style[leftIcon])} />
        }
        {text}
      </button>
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
