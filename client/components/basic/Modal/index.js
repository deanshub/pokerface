import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Modal extends Component {
  render(){
    const {open,children,onClose, closeOnBlur} = this.props
    if (open){
      let overlayProps = {}
      let containerProps = {
        onWheel: (e)=>e.preventDefault()
      }
      if (closeOnBlur){
        overlayProps.onClick=onClose
        containerProps.onClick=(e)=>e.stopPropagation()
      }

      return(
        <div className={classnames(style.overlay)} {...overlayProps}>
          <div className={classnames(style.modalContainer)} {...containerProps}>
            {children}
          </div>
        </div>
      )
    }
    return null
  }
}

export class ModalHeader extends Component {
  render(){
    const {children} = this.props
    return (
      <div className={classnames(style.modalHeader)}>
        {children}
      </div>
    )
  }
}
export class ModalContent extends Component {
  render(){
    const {children} = this.props
    return (
      <div className={classnames(style.modalContent)}>
        {children}
      </div>
    )
  }
}
export class ModalFooter extends Component {
  render(){
    const {children} = this.props
    return (
      <div className={classnames(style.modalFooter)}>
        {children}
      </div>
    )
  }
}
