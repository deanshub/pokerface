// @flow
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

@inject('routing')
@observer
export default class PlayerMention extends Component {
  render(){
    const {className, decoratedText, mention, routing} = this.props
    const url = mention._root.entries.filter(entry=>entry[0]==='link')[0][1]

    return (
      <a
          className={className}
          href={url}
          onClick={(e)=>{
            e.preventDefault()
            routing.push(url)
          }}
      >
        {decoratedText}
      </a>
    )
  }
}
