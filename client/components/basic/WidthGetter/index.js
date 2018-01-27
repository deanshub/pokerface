import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class WidthGetter extends Component {
  static propTypes = {
    render: PropTypes.function,
  }

  constructor(props) {
    super(props)

    this.state = {width: window.outerWidth || 0}
    this.resizeHandler = this.resizeHandler.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  resizeHandler() {
    this.setState({width: window.outerWidth})
  }

  render() {
    const { render } = this.props
    const { width } = this.state

    return render(width)
  }
}
