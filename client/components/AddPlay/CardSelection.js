import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'
import {SVG_SUITES} from '../Deck/consts'

function immutableSplice(arr, start, deleteCount, ...items) {
  return [ ...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount) ]
}

const cardsRank = [['2','3','4','5'],['6','7','8','9'],['T','J','Q','K','A']]
const cardsSigns = [
  {value:'h', name:'hearts', color:'#FF2733'},
  {value:'d', name:'diams', color:'#FF2733'},
  {value:'s', name:'spades', color:'#000'},
  {value:'c', name:'clubs', color:'#000'},
  // {value:'x',color:'#1220ac', text:'?'},
]

export default class CardSelection extends Component {
  static propTypes = {
    amount: PropTypes.number,
    onCardSelected: PropTypes.func.isRequired,
  }

  static defaultProps = {
    amount: 1,
  }

  constructor(props){
    super(props)
    this.state={
      values: Array.from(Array(props.amount)).map(()=>({})),
    }
  }

  selection(event, type, value, valueIndex){
    event.stopPropagation()
    const {values} = this.state
    const {rank, sign} = values[valueIndex]
    const newValues = immutableSplice(values, valueIndex, 1, {rank, sign, [type]: value})

    const allCardsAssigned = newValues.find(card=>!card.rank||!card.sign)===undefined

    if (allCardsAssigned){
      const {amount} = this.props
      this.props.onCardSelected(newValues.map(card=>`${card.rank}${card.sign}`).join(' '))
      this.setState({
        values: Array.from(Array(amount)).map(()=>({})),
      })
    }else{

      this.setState({
        values: newValues,
      })
    }
  }

  buildRankCard(rank, valueIndex){
    const {values} = this.state
    const stateRank = values[valueIndex].rank
    return (
      <div
          className={classnames(style.card, style.rankCard, {[style.selected]:stateRank===rank})}
          key={rank}
          onClick={(e)=>{this.selection(e,'rank',rank, valueIndex)}}
      >
        {rank}
      </div>
    )
  }
  buildSignCard(sign, valueIndex){
    const {values} = this.state
    const stateSign = values[valueIndex].sign
    return (
      <div
          className={classnames(style.card, style.signCard, {[style.selected]:stateSign===sign.value})}
          key={sign.value}
          onClick={(e)=>{this.selection(e,'sign',sign.value, valueIndex)}}
      >

        <img
            className={classnames(style.signCardImg)}
            src={SVG_SUITES[sign.name]}
        />
      </div>
    )
  }

  buildLine(line, index, valueIndex){
    return (
      <div className={classnames(style.rankLine)} key={index}>
        {line.map((rank)=>this.buildRankCard(rank, valueIndex))}
      </div>
    )
  }

  render(){
    const {amount} = this.props
    const arr = Array.from(Array(amount))
    return (
      <div className={classnames(style.multiCardsContainer)}>
        {arr.map((_,valueIndex)=>{
          let comps = []
          if (valueIndex>0){
            comps.push(
              <div className={classnames(style.sideDivider)} key={valueIndex+0.5}/>
            )
          }

          comps.push(
            <div className={classnames(style.cardSelectionContainer)} key={valueIndex}>
              {cardsRank.map((line, lineIndex)=>this.buildLine(line, lineIndex, valueIndex))}
              <div className={classnames(style.divider)}/>
              <div className={classnames(style.signLine)}>
                {cardsSigns.map((sign)=>this.buildSignCard(sign, valueIndex))}
              </div>
            </div>
          )
          return comps
        }
        )}
      </div>
    )
  }
}
