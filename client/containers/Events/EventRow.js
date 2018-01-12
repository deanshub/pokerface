import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Cover from '../../components/Cover'

@inject('events')
@observer
export default class EventRow extends Component {
  static propTypes = {
    game: PropTypes.shape().isRequired,
    isExpanded: PropTypes.bool,
  }

  render(){
    const { game, events, isExpanded } = this.props
    const details = events.eventToDetails(game)
    return (
      <Cover
          compact
          details={details}
          expanded={isExpanded}
      />
    )
  }
}
