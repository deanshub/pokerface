import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Popup } from 'semantic-ui-react'
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
            on={['hover','click','focus']}
            trigger={<span className={classnames(style.rangeBlock)}>{children}</span>}
        >
          <CardsTable
              inFeed
              sets={[{
                cards: range,
                color: '#67d388',
              }]}
              title={reverse(range)}
          />
        </Popup>
      )
    }
  }
}
