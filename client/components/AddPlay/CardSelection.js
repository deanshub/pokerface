import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

const cardsRank = ['2','3','4','5','6','7','8','9','T','J','Q','K','A']
const cardsSigns = [
  {value:'h',color:'#FF2733',fontSize:'200%', text:'♥'},
  {value:'d',color:'#FF2733',fontSize:'200%', text:'♦'},
  {value:'s',color:'#000',fontSize:'200%', text:'♠'},
  {value:'c',color:'#000',fontSize:'200%', text:'♣'},
  {value:'x',color:'#1220ac', text:'?'},
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

  render(){
    const {rank:stateRank, sign:stateSign} = this.state

    return (
      <div className={classnames(style.cardSelectionContainer)}>
        {cardsRank.map((rank, index, cardsRank)=>{
          const gridRow = `${Math.floor(index/3)+1} / span 1`
          const columnsSpan = index===cardsRank.length-1 ? 3:1
          const gridColumn = `${index%3+1} / span ${columnsSpan}`

          return (
            <div
                className={classnames({[style.item]:true, [style.selected]:stateRank===rank})}
                key={`1.${index}`}
                onClick={(e)=>{this.selection(e,'rank',rank)}}
                style={{gridRow, gridColumn}}
            >
              {rank}
            </div>
          )
        })}
        {cardsSigns.map((sign, index, cardsSigns)=>{
          const rowSpan = index===cardsSigns.length-1 ? 1:2
          const rowIndex = (Math.floor(index/2)+1)*2-1
          const gridRow = `${rowIndex} / span ${rowSpan}`
          const columnsSpan = index===cardsSigns.length-1 ? 2:1
          const gridColumn = `${index%2+5} / span ${columnsSpan}`

          return (
            <div
                className={classnames({[style.item]:true, [style.selected]:stateSign===sign.value})}
                key={`2.${index}`}
                onClick={(e)=>{this.selection(e,'sign',sign.value)}}
                style={{gridRow, gridColumn, color:sign.color, fontSize:sign.fontSize}}
            >
              {sign.text}
            </div>
          )
        })}
      </div>
    )
  }
}
