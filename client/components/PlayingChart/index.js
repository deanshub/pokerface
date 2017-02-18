import React, { Component, PropTypes } from 'react'
// import classnames from 'classnames'
// import style from './style.css'
import {RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer} from 'recharts'

export default class PlayingChart extends Component {
  static propTypes = {
    data: PropTypes.array,
    player: PropTypes.object.isRequired,
  }

  static defaultProps = {
    data: [],
  }

  render() {
    const {data, player} = this.props
    // <ResponsiveContainer>
    return (
        <RadarChart
            cx={300}
            cy={170}
            data={data}
            height={350}
            outerRadius={150}
            width={600}
        >
          <Radar name={player.name} dataKey="A" stroke="#DB2828" fill="#DB2828" fillOpacity={0.6}/>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis/>
          <Tooltip />
        </RadarChart>
    )
  // </ResponsiveContainer>
  }
}
