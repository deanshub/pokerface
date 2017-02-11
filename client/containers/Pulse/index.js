import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { Container } from 'semantic-ui-react'
import UnavailableSection from '../../components/UnavailableSection'
// import classnames from 'classnames'
// import style from './style.css'
// import * as BoardActions from '../../ducks/board'

class Pulse extends Component {
  render() {
    return (
      <UnavailableSection/>
    )
  }
}

function mapStateToProps(state) {
  return {
    // board: state.board,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // actions: bindActionCreators(BoardActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pulse)
