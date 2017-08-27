import React, { Component, PropTypes } from 'react'
import { Container } from 'semantic-ui-react'
// import UnavailableSection from '../UnavailableSection'
import SpotPlayer from '../../containers/SpotPlayer'

export default class Lern extends Component {
  render() {
    return (
      <Container fluid style={{height:'94vh'}}>
        {/* <UnavailableSection/> */}
        <SpotPlayer/>
      </Container>
    )
  }
}
