import React, { Component } from 'react'
import CardSelection from './index'
import Button from '../basic/Button'
import Modal from '../basic/Modal'
import Tooltip from '../basic/Tooltip'
import IsMobile from '../IsMobile'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class TooltipCardSelection extends Component {
  constructor(props){
    super(props)

    this.state = {open:false}
  }

  onCardSelected(cards){
    this.setState = {open:false}
    this.props.onCardSelected(cards)
  }

  render(){
    const {amount, className, trigger} = this.props
    const {open} = this.state

    return (
      <IsMobile
          render={(isMobile) => {
            return (
                <Tooltip
                  className={className}
                  modalStyle={isMobile&&amount>1}
                  open={open}
                  trigger={trigger}
                >
                  <CardSelection
                      amount={amount}
                      isMobile={isMobile}
                      onCardSelected={::this.onCardSelected}
                  />
                </Tooltip>
            )
          }}
      />
    )
  }
}
