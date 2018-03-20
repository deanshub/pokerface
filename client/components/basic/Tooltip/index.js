import React, { Component } from 'react'
import { Manager, Target, Popper, Arrow } from 'react-popper'
import OnBlur from '../OnBlur'
import classnames from 'classnames'
import style from './style.css'

export default class Tooltip extends Component {
  static defaultProps = {
    event: 'click',
    placement: 'bottom',
  }

  constructor(props){
    super(props)
    this.state={
      open: props.open||false,
      openByHover:false,
      opened:false,
    }
  }

  componentWillReceiveProps(props){
    const {open} = props
    if (open!==undefined && open!=this.state.open){
      this.setState({open})
    }
  }

  handleClick(e){
    const {oneClick} = this.props
    if (oneClick){
      this.setState({open:false})
    }

    e.stopPropagation()
  }

  handleMouseEnter(){
    this.setState({openByHover: true})
  }

  handleMouseLeave(){
    this.setState({openByHover: false})
  }

  toggle(e){
    e.stopPropagation()
    const {open} = this.state
    this.setState({open: !open, opened:true})
  }

  render(){
    const {
      className,
      children,
      event,
      modalStyle,
      onOpen,
      placement,
      trigger,
    } = this.props
    const {open, openByHover, opened} = this.state

    if(open && onOpen){
      setTimeout(onOpen)
    }

    const containerProps = {
      onClick: ::this.toggle,
    }

    const isHoverEvent = (event==='hover')
    if (isHoverEvent){
      containerProps.onMouseEnter = ::this.handleMouseEnter
      containerProps.onMouseLeave = ::this.handleMouseLeave
    }

    const renderPopup = opened || isHoverEvent

    return (
      <Manager className={classnames(className, style.manager)} {...containerProps}>
        <Target className={classnames(style.triggerContainer)}>
          {trigger}
        </Target>
        {
          renderPopup &&
          <Popper
              modifiers={{
                //preventOverflow:{boundariesElement:'viewport'},
              }}
              placement={placement}
          >
            {({popperProps, restProps})=>{
              if (modalStyle){
                popperProps.style = undefined
              }

              return (
                <OnBlur open={open}>
                  {
                    (openByBlur)=>{
                      return (
                        <div
                          {...popperProps}
                          {...restProps}
                          className={classnames(style.popperContainer, {[style.overlay]:modalStyle, [style.open]:open})}
                        >
                          <div
                              className={classnames(
                                style.popper,
                                {[style.open]: openByBlur || openByHover},
                              )}
                              onClick={::this.handleClick}
                          >
                            <div className={classnames(style.viewport)}>
                              {children}
                            </div>
                            <Arrow>
                              {({ arrowProps }) => {
                                if (modalStyle){
                                  arrowProps.style = {
                                    left: 'calc(50% - 0.4em)',
                                    bottom: '-0.2em'
                                  }
                                }
                                return (<span
                                    className={classnames(style.popper__arrow)}
                                    {...arrowProps}
                                />)
                              }}
                            </Arrow>
                          </div>
                        </div>
                      )
                    }
                  }
                </OnBlur>
              )
            }}
          </Popper>
        }
      </Manager>
    )
  }
}
