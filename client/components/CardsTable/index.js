// @flow

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'


const ranks = ['A','K','Q','J','T','9','8','7','6','5','4','3','2']
const predefinedSets = {
  monster:['AA','AKs','AKo','KK','QQ'],
}
const getRankValue = (rank)=>{
  return 13-ranks.indexOf(rank)
}

export default class CardsTable extends Component {
  constructor(props){
    super(props)
    this.state={
      sets: props.sets||[],
    }
  }

  componentWillReceiveProps(props){
    this.setState({sets: props.sets})
  }

  getHandElement(rank1,rank2, sets){
    let textValue
    if (rank1===rank2){
      textValue = rank1+rank2
    }else if (getRankValue(rank1)>getRankValue(rank2)){
      textValue = `${rank1}${rank2}s`
    }else{
      textValue = `${rank2}${rank1}o`
    }

    const relevantSet = sets.find(set=>{
      return !set.disabled && set.cards.includes(textValue)
    })

    let setStyle = {}
    if (relevantSet&&!relevantSet.disabled){
      setStyle.backgroundColor = relevantSet.color
    }

    return (
      <div
          className={classnames(style.hand)}
          key={rank1+rank2}
          style={setStyle}
      >
        {textValue}
      </div>
    )
  }

  toggleSet(index, e){
    const {ctrlKey} = e
    const {sets} = this.state
    const newSets = sets.map((set, setIndex)=>{
      if (ctrlKey){
        if (setIndex===index){
          set.disabled = !set.disabled
        }
      }else{
        set.disabled = setIndex!==index
      }
      return set
    })
    this.setState({
      sets: newSets,
    })
  }

  getLegend(set, index){
    return (
      <div
          className={classnames({
            [style.label]: true,
            [style.disabled]: set.disabled,
          })}
          key={index}
          onClick={(e)=>this.toggleSet(index, e)}
      >
        <div className={classnames(style.labelColor)} style={{backgroundColor:set.color}} />
        {set.label}
      </div>
    )
  }

  render() {
    const {title, subtitle} = this.props
    const {sets} = this.state
    const normalizedSets = sets.map(set=>{
      if (!Array.isArray(set.cards)){
        return {
          ...set,
          cards: predefinedSets[set.cards],
        }
      }
      return set
    })
    return (
      <div className={classnames(style.container)}>
        <div className={classnames(style.title, style.maintitle)}>
          {title}
        </div>
        <div className={classnames(style.title, style.subtitle)}>
          {subtitle}
        </div>
        <div className={classnames(style.handchartContainer)}>
          {
            ranks.map((rank1)=>{
              return ranks.map((rank2)=>{
                return this.getHandElement(rank1,rank2, normalizedSets)
              })
            })
          }
        </div>
        <div className={classnames(style.legend)}>
          {normalizedSets.map(this.getLegend.bind(this))}
        </div>
      </div>
    )
  }
}
