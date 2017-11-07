// @flow
import React, { Component, PropTypes } from 'react'
import { Button, Modal, Menu, Icon, Input, Dropdown } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'
import CardSelection from '../AddPlay/CardSelection'

@inject('spotPlayer')
@observer
export default class SpotWizard extends Component {
  constructor(props){
    super(props)
    this.state = {
      dealerCards: [],
      raiseValue: 10,
      raiseOptions:[
        {
          text: 10,
          value: 10,
          key: 10,
        },
        {
          text: 20,
          value: 20,
          key: 20,
        },
        {
          text: 50,
          value: 50,
          key: 50,
        },
        {
          text: 100,
          value: 100,
          key: 100,
        },
      ],
    }
  }

  addingRaiseOption(e, {value}){
    const {raiseOptions} = this.state

    this.setState({
      raiseOptions:[...raiseOptions, {text:value, value, key:value}],
    })
  }

  changeRaise(e, {value}){
    this.setState({
      raiseValue: value,
    })
  }

  dealerCardsChange(index, value){
    let newDealerCards = [...this.state.dealerCards]
    newDealerCards[index] = value
    this.setState({
      dealerCards: newDealerCards,
    })
  }

  render(){
    const {
      previousClick,
      previousDisabled,
      nextClick,
      nextDisabled,
      smallBlindClick,
      smallBlindDisabled,
      bigBlindClick,
      bigBlindDisabled,
      foldClick,
      foldDisabled,
      callClick,
      callDisabled,
      checkClick,
      checkDisabled,
      raiseClick,
      raiseDisabled,
      showCardsClick,
      showCardsDisabled,
      cancel,
      saveDisabled,
      save,
      dealerDisabled,
      dealerClick,
      dealerNextState,
    } = this.props
    const {raiseOptions, raiseValue, dealerCards} = this.state
    const dealerCardPositions = dealerNextState==='Flop'?[undefined,undefined,undefined]:[undefined]

    return (
      <Modal.Actions>
        <Menu>
          <Menu.Menu>
            <Menu.Item
                disabled={showCardsDisabled}
                name="showcards"
                onClick={showCardsClick}
            >
              <Icon name="eye" />
              Show Cards
            </Menu.Item>
            <Menu.Item
                disabled={smallBlindDisabled}
                name="smallblind"
                onClick={smallBlindClick}
            >
              <Icon.Group>
                <Icon name="money" />
                <Icon corner name="minus" />
              </Icon.Group>
              Small Blind
            </Menu.Item>
            <Menu.Item
                disabled={bigBlindDisabled}
                name="bigblind"
                onClick={bigBlindClick}
            >
              <Icon.Group>
                <Icon name="money" />
                <Icon corner name="plus" />
              </Icon.Group>
              Big Blind
            </Menu.Item>
          </Menu.Menu>

          <Menu.Menu position="right" style={{borderRight:'1px solid rgba(34,36,38,.1)'}}>
            <Menu.Item
                disabled={foldDisabled}
                name="fold"
                onClick={foldClick}
            >
              <Icon.Group>
                <Icon name="hand paper" />
                <Icon corner name="dollar" />
              </Icon.Group>
              Fold
            </Menu.Item>
            <Menu.Item
                disabled={callDisabled}
                name="call"
                onClick={callClick}
            >
              <Icon.Group>
                <Icon name="hand rock" />
                <Icon corner name="dollar" />
              </Icon.Group>
              Call
            </Menu.Item>
            <Menu.Item
                disabled={checkDisabled}
                name="check"
                onClick={checkClick}
            >
              <Icon.Group>
                <Icon name="hand rock" />
                <Icon corner name="dollar" />
              </Icon.Group>
              Check
            </Menu.Item>
            <Menu.Item
                disabled={raiseDisabled}
                name="raise"
                onClick={()=>raiseClick(raiseValue)}
            >
              <Icon.Group>
                <Icon name="hand lizard" />
                <Icon corner name="dollar" />
              </Icon.Group>
              Raise
              <Dropdown
                  additionLabel=""
                  allowAdditions
                  className={classnames(style.raiseDropdown)}
                  defaultValue={10}
                  onAddItem={::this.addingRaiseOption}
                  onChange={::this.changeRaise}
                  options={raiseOptions}
                  search
                  selection
                  upward
              />
            </Menu.Item>
          </Menu.Menu>

          <Menu.Menu position="right">
            {dealerNextState!=='none'?(
              <Menu.Item>
                {dealerNextState}:
                {dealerCardPositions.map((_,index)=>(
                  <Input
                      className={classnames(style.dealerCardsInput)}
                      key={index}
                      label={
                        <Dropdown defaultValue="..." upward>
                          <Dropdown.Menu>
                            <Dropdown.Header content="Select a card" icon="tags" />
                            <Dropdown.Divider />
                            <CardSelection
                                onCardSelected={(card)=>this.dealerCardsChange(index,card)}
                            />
                          </Dropdown.Menu>
                        </Dropdown>
                      }
                      labelPosition="right"
                      onChange={(e, {value})=>this.dealerCardsChange(index,value)}
                      onClick={(e)=>e.stopPropagation()}
                      size="mini"
                      value={dealerCards[index]}
                  />
                ))}
                <Button
                    color="green"
                    disabled={dealerDisabled}
                    icon="announcement"
                    onClick={()=>{dealerClick(dealerCards.join(''))}}
                    size="mini"
                    style={{marginLeft:10}}
                />
              </Menu.Item>
            ):null}
          </Menu.Menu>
          <Menu.Menu>
            <Menu.Item
                disabled={previousDisabled}
                name="prev"
                onClick={previousClick}
            >
              <Icon name="arrow left" />
              Previous Step
            </Menu.Item>
            <Menu.Item
                disabled={nextDisabled}
                name="next"
                onClick={nextClick}
            >
              <Icon name="arrow right" />
              Next Step
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Modal.Actions>
    )
  }
}
