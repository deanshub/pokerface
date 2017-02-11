import React, { Component, PropTypes } from 'react'
// import classnames from 'classnames'
// import style from './style.css'
import { Header, Container } from 'semantic-ui-react'

export default class UnavailableSection extends Component {
  render() {
    return (
      <Container text>
        <Header>
          This Section isn't available yet
        </Header>
      </Container>
    )
  }
}
