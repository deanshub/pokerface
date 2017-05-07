// @flow
import React, { Component, PropTypes } from 'react'

export default class PlayerMention extends Component {
  render(){
    const {className, decoratedText} = this.props
    return (
      <span className={className} onClick={()=>{console.log(this.props)}}>
        {decoratedText}
      </span>
    )
  }
}
