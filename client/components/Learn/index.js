import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import CardsTable from '../CardsTable'
import {openRaiseSets} from './openRaiseSets'

export default class Lern extends Component {
  render() {
    return (
      <div>
        <CardsTable
            sets={openRaiseSets}
            subtitle="Opening bet pre-flop by position"
            title="Open-Raise by position"
        />
      </div>
    )
  }
}
