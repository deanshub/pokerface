import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import ResponsiveText from '../basic/ResponsiveText'
import Button,{ButtonGroup} from '../basic/Button'
import classnames from 'classnames'
import style from './style.css'

@inject('timer')
@observer
export default class TournementManager extends Component {
  addPlayer(){
    const {timer} = this.props
    timer.tournamentManager.entries++
    timer.tournamentManager.totalPlayers++
    timer.tournamentManager.playersLeft++
    timer.tournamentManager.totalChips+= timer.tournamentManager.chipsPerPlayer
  }
  removePlayer(){
    const {timer} = this.props
    timer.tournamentManager.playersLeft--
  }
  render(){
    const {timer} = this.props

    return(
      <div className={classnames(style.tournamentManagerContainer, {[style.inverted]:timer.inverted})}>
        <ResponsiveText className={classnames(style.tiles)} scale={1.4}>
          <div className={classnames(style.tile)}>
            <div className={classnames(style.tileTitle)}>
              Players Remaining
            </div>
            <div className={classnames(style.tileValue)}>
              {timer.tournamentManager.playersLeft}
            </div>
          </div>
          <div className={classnames(style.tile)}>
            <div className={classnames(style.tileTitle)}>
              Avg Stack
            </div>
            <div className={classnames(style.tileValue)}>
              {Math.round(timer.tournamentManager.totalChips/timer.tournamentManager.playersLeft)}
            </div>
          </div>
          <div className={classnames(style.tile)}>
            <div className={classnames(style.tileTitle)}>
              Total Chip Count
            </div>
            <div className={classnames(style.tileValue)}>
              {timer.tournamentManager.totalChips}
            </div>
          </div>
        </ResponsiveText>
        <ButtonGroup
            center
            horizontal
            noEqual
        >
          <Button className={classnames(style.button)} onClick={::this.addPlayer}>+</Button>
          <Button className={classnames(style.button)} onClick={::this.removePlayer}>-</Button>
        </ButtonGroup>
        <ResponsiveText>
          <pre>
            {timer.tournamentManager.text}
          </pre>
        </ResponsiveText>
      </div>
    )
  }
}
