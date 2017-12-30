import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'
import OnBlur from '../OnBlur'

export default class DropDown extends Component {
  constructor(props){
    super(props)
    this.state={
      open: props.open||false,
    }
  }

  componentWillReceiveProps(props){
    if (props.open!=this.state.open){
      this.setState({
        open: props.open,
      })
    }
  }

  toggle(e){
    e.stopPropagation()
    const {open} = this.state
    this.setState({
      open: !open,
    })
  }

  render(){
    const {children, trigger} = this.props
    const {open} = this.state

    return React.cloneElement(trigger, {
      onClick: ::this.toggle,
      style: {position:'relative'},
    }, (
      <OnBlur open={open}>
        {
          (openByBlur)=>{
            return (
              <div
                  className={classnames(
                    style.dropDown,
                    {[style.dropDownOpen]: openByBlur},
                  )}
                  onClick={e=>e.stopPropagation()}
              >
                {children}
              </div>
            )
          }
        }
      </OnBlur>
    ))
  }
}
