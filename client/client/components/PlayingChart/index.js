import React, { Component } from 'react'
import PropTypes from 'prop-types'
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

  constructor(props){
    super(props)
    this.state = {
      height:150,
      cy:100,
      width:600,
      cx:300,
      outerRadius:75,
    }
  }

  resizeChart(){
    const height = this.container.height
    const cy = height-50
    const width = this.container.width
    const cx = width/2
    const outerRadius = cx/2
    this.setState({
      height,
      cy,
      width,
      cx,
      outerRadius,
    })
  }

  componentDidMount(){
    this.resizeChart()
  }

  render() {
    const {data, player} = this.props
    const {
      height,
      cy,
      width,
      cx,
      outerRadius,
    }=this.state
    return (
      <ResponsiveContainer ref={(container)=>this.container=container}>
        <RadarChart
            cx={cx}
            cy={cy}
            data={data}
            height={height}
            outerRadius={outerRadius}
            width={width}
        >
          <Radar name={player.fullname} dataKey="A" stroke="#DB2828" fill="#DB2828" fillOpacity={0.6}/>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis/>
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    )
  }
}
