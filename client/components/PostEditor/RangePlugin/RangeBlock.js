import React, { Component, PropTypes } from 'react'
import { Popup, Grid } from 'semantic-ui-react'
import classnames from 'classnames'

import prange, {reverse} from '../../../utils/rangeParser/prange'
import CardsTable from '../../CardsTable'
import style from './style.css'

export default class RangeBlock extends Component {
  render(){
    const { children, decoratedText  } = this.props

    const rangeText = decoratedText.substring(1,decoratedText.length-1)
    let range
    try {
      range = prange(rangeText)
    } catch (e) {
      console.error(e)
    }
    if (!range){
      return (
        <span className={classnames(style.rangeBlock)}>
          {children}
        </span>
      )
    }else{
      return(
        <Popup
            flowing
            hoverable
            trigger={<span className={classnames(style.rangeBlock)}>{children}</span>}
        >
          <CardsTable
              inFeed
              sets={[{
                cards: range,
                color: '#a5d6a7',
              }]}
              title={reverse(range)}
          />
        </Popup>
      )
    }
  }
}
