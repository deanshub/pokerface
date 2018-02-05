import React, { Component } from 'react'
import ResponsiveContainer from '../../ResponsiveContainer'
import Button from '../Button'
import classnames from 'classnames'
import style from './style.css'

export default class Modal extends Component {
  render(){
    const {
      showCloseButton,
      open,
      children,
      onClose,
      closeOnBlur,
      simple,
      inverted,
      compact,
    } = this.props
    if (open){
      let overlayProps = {}
      let containerProps = {
        onWheel: (e)=>{
          e.stopPropagation()
        },
      }
      if (closeOnBlur){
        overlayProps.onClick=onClose
        containerProps.onClick=(e)=>e.stopPropagation()
      }

      return(
        <div className={classnames(style.overlay, {[style.inverted]: inverted})} {...overlayProps}>
          <ResponsiveContainer
              desktopClassName={classnames(style.modalContainer, {[style.modalBackground]: !simple, [style.compact]: compact})}
              mobileClassName={classnames(style.mobileModalContainer, {[style.inverted]: inverted})}
              {...containerProps}
          >
            {showCloseButton&&
              <Button
                  className={classnames(style.closeModal)}
                  leftIcon="fold"
                  onClick={onClose}
              />
            }
            {children}
          </ResponsiveContainer>
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
