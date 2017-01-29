import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import {Icon} from 'react-fa'
import Col from '../Col'
import Row from '../Row'

export default class AddGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      players: [],
    }
  }
  render() {
    return (
      <div className={classnames(style.container)}>
        <Row>
          <Col flex={4}/>
          <Col>
            <Icon name="list-ul"/>
            <div>Game Type</div>
          </Col>
          <Col flex={4}/>
        </Row>
        <Row>
          <Col>
            <Icon name="map-marker"/>
            <div>Location</div>
          </Col>
          <Col flex={0.5}/>
          <Col>
            <Icon name="clock-o"/>
            <div>From</div>
          </Col>
          <Col>
            <div>To</div>
          </Col>
        </Row>
        <Row>
          <Col>
            Players
          </Col>
        </Row>
      </div>
    )
  }
}
