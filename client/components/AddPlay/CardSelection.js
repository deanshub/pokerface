import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'
import {SVG_SUITES} from '../Deck/consts'

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
    onCardSelected: PropTypes.func.isRequired,
  }

  constructor(props){
    super(props)
    this.state={}
  }

  selection(event, type, value){
    event.stopPropagation()
    const {rank, sign} = this.state
    if ((rank && type==='sign')||(sign && type==='rank')){
      const selectedCard = {
        sign,
        rank,
        [type]:value,
      }
      this.props.onCardSelected(`${selectedCard.rank}${selectedCard.sign}`)
      this.setState({
        rank:undefined,
        sign:undefined,
      })
    }else{
      this.setState({
        [type]: value,
      })
    }
  }

  buildRankCard(rank){
    const {rank:stateRank} = this.state
    return (
      <div
          className={classnames(style.card, style.rankCard, {[style.selected]:stateRank===rank})}
          key={rank}
          onClick={(e)=>{this.selection(e,'rank',rank)}}
      >
        {rank}
      </div>
    )
  }
  buildSignCard(sign){
    const {sign:stateSign} = this.state
    return (
      <div
          className={classnames(style.card, style.signCard, {[style.selected]:stateSign===sign.value})}
          key={sign.value}
          onClick={(e)=>{this.selection(e,'sign',sign.value)}}
      >

        <img
            src={SVG_SUITES[sign.name]}
        />
      </div>
    )
  }

  buildLine(line,index){
    return (
      <div className={classnames(style.rankLine)} key={index}>
        {line.map(::this.buildRankCard)}
      </div>
    )
  }

  render(){
    return (
      <div className={classnames(style.cardSelectionContainer)}>
        {cardsRank.map(::this.buildLine)}
        <div className={classnames(style.divider)}/>
        <div className={classnames(style.signLine)}>
          {cardsSigns.map(::this.buildSignCard)}
        </div>
      </div>
    )
  }
}
