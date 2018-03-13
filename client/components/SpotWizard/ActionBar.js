// @flow
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import Button from '../basic/Button'
import Input from '../basic/Input'
import Tooltip from '../basic/Tooltip'

@inject('spotPlayer')
@observer
export default class SpotWizard extends Component {
  constructor(props){
    super(props)
    this.state = {
      dealerCards: '',
      raiseValue: props.minimumRaise||0,
      raiseOpen: false,
    }
  }

  componentWillReceiveProps(props){
    this.setState({
      raiseValue: props.minimumRaise||0,
    })
  }

  changeRaise(e, {value}){
    e.stopPropagation()
    const raiseValue = parseFloat(value)
    if (raiseValue){
      this.setState({
        raiseValue,
        raiseOpen: true,
      })
    }
  }

  dealerCardsChange(e, {value}){
    this.setState({
      dealerCards: value,
    })
  }

  publishDealerCards(){
    const {dealerClick} = this.props
    const {dealerCards} = this.state
    dealerClick(dealerCards)
    this.setState({
      dealerCards:'',
    })
  }

  localRaise(){
    const {raiseClick} = this.props
    const {raiseValue} = this.state
    raiseClick(raiseValue)
    this.setState({
      raiseOpen: false,
    })
  }

  getMiddleActions(){
    const {
      dealerDisabled, raiseClick, checkDisabled, callClick,
      checkClick, foldClick, dealerNextState,
      minimumRaise, maximumRaise, gameEnded,
    } = this.props
    const {dealerCards, raiseValue, raiseOpen} = this.state
    const actions = []

    if(!gameEnded && dealerDisabled){
      actions.push(
        <Button
            key="fold"
            leftIcon="fold"
            onClick={foldClick}
            simple
            style={{flex:1}}
        >
          Fold
        </Button>
      )
      actions.push(<div className={classnames(style.divider)} key="d1"/>)
      if (checkDisabled){
        actions.push(
          <Button
              className={style.action}
              key="call"
              leftIcon="call"
              onClick={callClick}
              simple
          >
            Call
          </Button>
        )
      }else{
        actions.push(
          <Button
              className={style.action}
              key="check"
              leftIcon="check"
              onClick={checkClick}
              simple
          >
            Check
          </Button>
        )
      }
      actions.push(<div className={classnames(style.divider)} key="d2"/>)
      actions.push(
        <Tooltip
            className={style.action}
            key="raise"
            onOpen={()=>this.raiseInput&&this.raiseInput.focus()}
            open={raiseOpen}
            style={{padding:'0 6px'}}
            trigger={
              <Button
                  key="raise"
                  leftIcon="raise"
                  simple
                  style={{width:'100%'}}
              >
                Raise
              </Button>
            }
        >
          <div className={classnames(style.raiseBox)}>
            <Input
                max={maximumRaise}
                min={minimumRaise}
                onChange={::this.changeRaise}
                type="range"
                value={raiseValue}
            />
            <Input
                onChange={::this.changeRaise}
                ref={(el)=>this.raiseInput = el}
                rightButton={
                  <Button
                      onClick={()=>this.localRaise(raiseValue)}
                      simple
                      small
                  >
                    Raise
                  </Button>
                }
                value={raiseValue}
            />
          </div>
        </Tooltip>
      )
    }else if(!gameEnded){
      actions.push(
        <Input
            amount={dealerNextState==='Flop'?3:1}
            cardSelection
            key="dealerCards"
            onChange={::this.dealerCardsChange}
            value={dealerCards}
        />
      )
      actions.push(
        <Button
            disable={!dealerCards||dealerCards===''}
            key="dealerButton"
            onClick={::this.publishDealerCards}
            simple
        >
          {dealerNextState}
        </Button>
      )
    }
    return actions
  }

  render(){
    const {
      showCardsClick,
      showCardsDisabled,
      toggleStepsMenu,
    } = this.props

    return (
      <div className={classnames(style.actionBar)}>
        <div className={classnames(style.actionBarLeftPane)}>
          <Button
              onClick={toggleStepsMenu}
              leftIcon="menu"
          />
        </div>
        <div className={classnames(style.actionBarMiddlePane)}>
          {
            this.getMiddleActions()
          }
        </div>
        <div className={classnames(style.actionBarRightPane)}>
          <Button
              hidden={showCardsDisabled}
              leftIcon="show"
              onClick={showCardsClick}
          />
        </div>
      </div>
    )
  }
}
