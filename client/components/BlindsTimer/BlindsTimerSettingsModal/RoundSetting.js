import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../../basic/Button'
import Input from '../../basic/Input'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'

@inject('timer')
@observer
export default class BlindsTimer extends Component {
  static propTypes ={
    roundIndex: PropTypes.number.isRequired,
    round: PropTypes.object.isRequired,
  }

  render() {
    const {timer, round, roundIndex} = this.props

    return round.type==='break'?
      <div className={classnames(style.breakRow)}>
        {`${round.time} Minutes Break`}
        <Button
            leftIcon="remove"
            onClick={()=>timer.removeRound(roundIndex)}
        />
      </div>
      :
      <div className={classnames(style.blindRow)}>
        <div className={classnames(style.roundNumber)}>{`Round ${roundIndex+1}`}</div>
        <Input
            label="Small Blind"
            min={0}
            onChange={(ev,{value})=>timer.updateRound(round, 'smallBlind', parseFloat(value))}
            type="number"
            value={round.smallBlind}
        />
        <Input
            label="Big Blind"
            min={0}
            onChange={(ev,{value})=>timer.updateRound(round, 'bigBlind', parseFloat(value))}
            type="number"
            value={round.bigBlind}
        />
        <Input
            label="Ante"
            min={0}
            onChange={(ev,{value})=>timer.updateRound(round, 'ante', parseFloat(value))}
            type="number"
            value={round.ante}
        />
        <Input
            label="Duration"
            min={0}
            onChange={(ev,{value})=>timer.updateRound(round, 'time', parseFloat(value))}
            type="number"
            value={round.time}
        />
        <Button
            leftIcon="remove"
            onClick={()=>timer.removeRound(roundIndex)}
        />
      </div>
  }
}
