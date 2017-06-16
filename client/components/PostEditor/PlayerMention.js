// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'

@inject('routing')
@observer
export default class PlayerMention extends Component {
  render(){
    const {className, decoratedText} = this.props
    return (
      <span
          className={className}
          onClick={()=>{
            const url = this.props.mention._root.entries[3][1]
            this.props.routing.push(url)
          }}
      >
        {decoratedText}
      </span>
    )
  }
}
