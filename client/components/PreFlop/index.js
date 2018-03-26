import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import CardsTable from '../CardsTable'
import {openRaiseSets} from './openRaiseSets'

export default class PreFlop extends Component {
  render() {
    const {theme} = this.props
    
    return (
      <div>
        <CardsTable
            sets={openRaiseSets}
            subtitle="Opening bet pre-flop by position"
            theme={theme}
            title="Open-Raise by position"
        />
      </div>
    )
  }
}
