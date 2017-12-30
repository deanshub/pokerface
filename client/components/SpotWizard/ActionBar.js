// @flow
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import Button from '../basic/Button'
import Input from '../basic/Input'
import DropDown from '../basic/DropDown'

@inject('spotPlayer')
@observer
export default class SpotWizard extends Component {
  constructor(props){
    super(props)
    this.state = {
      dealerCards: '',
      raiseValue: props.minimumRaise||0,
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

  getMiddleActions(){
    const {
      dealerDisabled, raiseClick, checkDisabled, callClick,
      checkClick, foldClick, dealerNextState,
      minimumRaise, maximumRaise,
    } = this.props
    const {dealerCards, raiseValue} = this.state
    const actions = []

    if(dealerDisabled){
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
              key="call"
              leftIcon="call"
              onClick={callClick}
              simple
              style={{flex:1}}
          >
            Call
          </Button>
        )
      }else{
        actions.push(
          <Button
              key="check"
              leftIcon="check"
              onClick={checkClick}
              simple
              style={{flex:1}}
          >
            Check
          </Button>
        )
      }
      actions.push(<div className={classnames(style.divider)} key="d2"/>)
      actions.push(
        <DropDown
            key="raise"
            trigger={
              <Button
                  key="raise"
                  leftIcon="raise"
                  simple
                  style={{flex:1}}
              >
                <span>Raise</span>
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
                rightButton={
                  <Button
                      onClick={()=>raiseClick(raiseValue)}
                      simple
                      small
                  >
                    Raise
                  </Button>
                }
                value={raiseValue}
            />
          </div>
        </DropDown>
      )
    }else{
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
    } = this.props

    return (
      <div className={classnames(style.actionBar)}>
        <div className={classnames(style.actionBarLeftPane)}>
          <Button
              disabled={showCardsDisabled}
              leftIcon="menu"
              onClick={showCardsClick}
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
