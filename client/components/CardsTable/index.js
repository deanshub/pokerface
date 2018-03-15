// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ResponsiveText from '../basic/ResponsiveText'
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
  static defaultProps = {
    inFeed: false,
  }
  static propTypes = {
    inFeed: PropTypes.bool,
  }

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
    const {defaultSet} = this.props
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
      setStyle.color = 'black'
    }else if (defaultSet){
      setStyle.backgroundColor = defaultSet.color
    }

    return (
      <td
          className={classnames(style.hand)}
          key={rank1+rank2}
          style={setStyle}
      >
        {textValue}
      </td>
    )
  }

  toggleSet(index, e){
    // const {ctrlKey} = e
    const {sets} = this.state
    const newSets = sets.map((set, setIndex)=>{
      // if (ctrlKey){
      if (setIndex===index){
        set.disabled = !set.disabled
      }
      // }else{
      //   set.disabled = setIndex!==index
      // }
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
        <div className={classnames(style.labelColor)} style={{backgroundColor:set.color, opacity:set.disabled?0.4:1}} />
        {set.label}
      </div>
    )
  }

  render() {
    const {title, subtitle, inFeed, textColor, defaultSet} = this.props
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
      <div className={classnames(style.container, {[style.inFeed]:inFeed})} style={{color:textColor}}>
        <div className={classnames(style.title, style.maintitle, {[style.inFeed]:inFeed})}>
          {title}
        </div>
        <div className={classnames(style.title, style.subtitle, {[style.inFeed]:inFeed})}>
          {subtitle}
        </div>
        <ResponsiveText scale={0.15}>
          <table
              className={classnames({
                [style.handchartContainer]:true,
                [style.inFeed]: inFeed,
              })}
          >
            <tbody>
              {
                ranks.map((rank1, index)=>{
                  return (
                    <tr key={index}>
                      {
                        ranks.map((rank2)=>{
                          return this.getHandElement(rank1,rank2, normalizedSets)
                        })
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </ResponsiveText>
        {
          normalizedSets.length>1?
          <div className={classnames(style.legend)}>
            {normalizedSets.map(this.getLegend.bind(this))}
          </div>
          :null
        }
        {
          normalizedSets.length===1&&defaultSet&&defaultSet.label?
          <div className={classnames(style.legend)}>
            {normalizedSets.map(this.getLegend.bind(this))}
            {this.getLegend(defaultSet)}
          </div>
          :null
        }
      </div>
    )
  }
}
