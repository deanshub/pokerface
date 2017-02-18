import React, { Component, PropTypes } from 'react'
// import classnames from 'classnames'
// import style from './style.css'
// import * as BoardActions from '../../ducks/board'
import DevTools from 'mobx-react-devtools'
import Navbar from '../../components/Navbar'
import 'semantic-ui-css/semantic.min.css'

export default class Navigation extends Component {
  static propTypes={
    children: PropTypes.element,
  }

  render() {
    // const { board, actions, children } = this.props
    const { children } = this.props

    return (
      <div>
        {
          process.env.NODE_ENV==='development'?<DevTools/>:null
        }
        <Navbar />
        <div style={{paddingTop: 51}}>
          {children}
        </div>
      </div>
    )
  }
}
