import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import style from './style.css'
import Cover from '../../components/Cover'
import ProfileNavbar from '../../components/ProfileNavbar'
// import * as BoardActions from '../../ducks/board'

class Feed extends Component {
  render() {
    const { login } = this.props

    return (
      <div className={classnames(style.container)}>
        <Cover
            image={login.user.coverImage}
            title={login.user.displayName}
        />
      <ProfileNavbar
          avatar={login.user.avatarImage}
      />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
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
