import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Container } from 'semantic-ui-react'
import CardsTable from '../CardsTable'
import {openRaiseSets} from './openRaiseSets'
// import UnavailableSection from '../UnavailableSection'

export default class Lern extends Component {
  render() {
    return (
      <Container fluid style={{height:'94vh'}}>
        <CardsTable
            sets={openRaiseSets}
            subtitle="Opening bet pre-flop by position"
            title="Open-Raise by position"
        />
        {/* <UnavailableSection/> */}
      </Container>
    )
  }
}
