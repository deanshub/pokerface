// @flow
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

@inject('routing')
@observer
class PlayerMention extends Component {
  render(){
    const {className, decoratedText, mention, routing} = this.props
    const url = mention.link

    return (
      <a
          className={className}
          href={url}
          onClick={(e)=>{
            e.preventDefault()
            routing.push(url)
          }}>
        {decoratedText}
      </a>
    )
  }
}
export default PlayerMention
