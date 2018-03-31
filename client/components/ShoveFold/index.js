import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import CardsTable from '../CardsTable'
import prange, {reverse} from '../../utils/rangeParser/prange'
import defaultShoveData from '../../utils/shovingTable/ante00/01bb'
import Select from '../basic/Select'
import classnames from 'classnames'
import style from './style.css'

const stackOptions = Array.from(Array(20)).map((_, index)=>{
  return {text: `${index+1}BB`, value:index+1}
})

const positionOptions = [
  {text: 'Small Blind', value:'sb'},
  {text: 'Dealer', value: 'dealer'},
  {text: 'CO', value: 'co'},
  {text: 'HJ', value: 'hj'},
  {text: 'MP2', value: 'mp2'},
  {text: 'MP1', value: 'mp1'},
  {text: 'UTG+1', value: 'utg1'},
  {text: 'UTG', value: 'utg'},
]

const anteOptions = [
  {text: '0%', value:0},
  {text: '10%', value:10},
  {text: '12.5%', value:12.5},
  {text: '20%', value:20},
]

export default class ShoveFold extends Component {
  constructor(props){
    super(props)
    this.state = {
      anteOption: 0,
      stackOption: 1,
      positionOption: 'sb',
      shoveData: defaultShoveData,
    }
  }

  changePosition(value){
    this.setState({
      positionOption: value,
    })
  }

  changeAnte(value){
    this.setState({
      anteOption: anteOptions.findIndex(option=>option.value===value),
    })
    const stacks = this.state.stackOption
    import(`../../utils/shovingTable/ante${value<10?`0${value}`:value}/${stacks<10?`0${stacks}`:stacks}bb`).then(shoveData=>{
      this.setState({
        shoveData: shoveData.default,
      })
    })
  }

  changeStack(value){
    this.setState({
      stackOption: value,
    })
    const ante = anteOptions[this.state.anteOption].value
    import(`../../utils/shovingTable/ante${ante<10?`0${ante}`:ante}/${value<10?`0${value}`:value}bb`).then(shoveData=>{
      this.setState({
        shoveData: shoveData.default,
      })
    })
  }

  render() {
    const {theme} = this.props
    const {anteOption, stackOption, positionOption, shoveData} = this.state
    const selectedStack = stackOptions[stackOption-1]

    const stack = parseInt(Object.keys(shoveData.stack)[0])
    const ante = shoveData.ante
    const positionLabel = positionOptions.find(pos=>pos.value===positionOption).text

    const bbData = shoveData.stack[stack<10?`0${stack}`:stack][positionOption]

    const range = prange(bbData.range)
    return (
      <div>
        <div className={classnames(style.options)}>
          <Select
              label="Position"
              onChange={::this.changePosition}
              options={positionOptions}
              value={positionOption}
          />
          <Select
              label="Ante"
              onChange={::this.changeAnte}
              options={anteOptions}
              value={anteOptions[anteOption]}
          />
          <Select
              label="Stack"
              onChange={::this.changeStack}
              options={stackOptions}
              value={selectedStack}
          />
        </div>

        <CardsTable
            defaultSet={{color:'#ff5a5a',label:'Fold'}}
            sets={[{
              cards: range,
              color: '#67d388',
              label: 'All-In',
            }]}
            subtitle={`${bbData.percent}% - ${bbData.range}`}
            theme={theme}
            title={`Shove\\ Fold on ${stack}BB ${ante?`with ${ante}% ante`:''} in ${positionLabel} position`}
        />
      </div>
    )
  }
}
