import React, { Component } from 'react'
import {Tooltip as TippyTooltip} from 'react-tippy'
import 'react-tippy/dist/tippy.css'

export default class Tooltip extends Component {

  constructor(props){
    super(props)
    this.state={
      open: props.open||false,
      openByHover:false,
    }
  }

  render(){
    const {children, trigger} = this.props

    return (
      <TippyTooltip
          style={{maxWidth:'default'}}
          arrowSize="big"
          theme="transparent"
          animateFill={false}
          arrow
          html={children}
          trigger="click"
          popperOptions={{
            modifiers: {
              preventOverflow: {
                enabled: true,
              },
            },
          }}
      >
        {trigger}
      </TippyTooltip>
    )
  }
}
