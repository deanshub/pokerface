import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import style from './style.css'
// import * as BoardActions from '../../ducks/board'

class Feed extends Component {
  render() {
    // const { board, actions, children } = this.props

    return (
      <div className={classnames(style.container)}>
        Profile page
      </div>
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
)(Feed)
