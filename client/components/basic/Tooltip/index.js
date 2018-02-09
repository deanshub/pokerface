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
    const {children, trigger, onOpen, event, className, placement} = this.props
    const {open, openByHover, opened} = this.state

    if(open && onOpen){
      setTimeout(onOpen)
    }

    const containerProps = {
      onClick: ::this.toggle,
    }

    if (event==='hover'){
      containerProps.onMouseEnter = ::this.handleMouseEnter
      containerProps.onMouseLeave = ::this.handleMouseLeave
    }

    return (
      <Manager className={classnames(className, style.manager)} {...containerProps}>
        <Target className={classnames(style.triggerContainer)}>
          {trigger}
        </Target>
        {opened && <Popper className={classnames(style.popperContainer)} placement={placement}>
            <OnBlur open={open}>
              {
                (openByBlur)=>{
                  return (
                    <div
                        className={classnames(
                          style.popper,
                          {[style.popperOpen]: openByBlur || openByHover},
                        )}
                        onClick={::this.handleClick}
                    >
                      {children}
                      <Arrow>
                        {({ arrowProps }) => (
                          <span
                              className={classnames(style.popper__arrow)}
                              {...arrowProps}
                          />
                        )}
                      </Arrow>
                    </div>
                  )
                }
              }
            </OnBlur>
        </Popper>}
      </Manager>
    )
  }
}
