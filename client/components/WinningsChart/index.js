import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import classnames from 'classnames'
// import style from './style.css'
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts'

export default class WinningsChart extends Component {
  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }

  render() {
    const {data} = this.props
    return (
      <ResponsiveContainer>
        <LineChart
            data={data}
            height={300}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            width={600}
        >
          <Line
              dataKey="winSum"
              stroke="#21BA45"
              type="monotone"
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="location" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    )
  }
}
