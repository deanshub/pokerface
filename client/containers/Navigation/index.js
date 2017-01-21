import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import style from './style.css'
// import * as BoardActions from '../../ducks/board'
import Navbar from '../../components/Navbar'

class Navigation extends Component {
  static propTypes={
    children: PropTypes.element,
  }

  render() {
    // const { board, actions, children } = this.props
    const { children } = this.props

    return (
      <div className={classnames(style.container)}>
        <Navbar />
        <div className={classnames(style.mainContent)}>
          {children}
        </div>
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
)(Navigation)
