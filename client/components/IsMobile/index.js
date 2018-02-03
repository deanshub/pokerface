// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { mobileMaxWidth } from '../../constants/styles.css'
import WidthGetter from '../basic/WidthGetter'

export default class IsMobile extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
  }

  static defaultProps = {
    opposite: false,
  }

  render() {
    const { render } = this.props

    return (
      <WidthGetter
          render={(width) => {
            const isMobile = width <= mobileMaxWidth

            return render(isMobile)
          }}
      />
    )
  }
}
