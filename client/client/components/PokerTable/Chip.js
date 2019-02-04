import React, { Component } from 'react'
import PropTypes from 'prop-types'

// import classnames from 'classnames'
// import style from './style.css'

export default class Chip extends Component {
  static propTypes = {
    index: PropTypes.number,
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
  }

  static defaultProps = {
    primaryColor: '#25AAE1',
    secondaryColor: '#ffffff',
  }

  render(){
    const {primaryColor, secondaryColor, index} = this.props
    const zIndex = index>0?index:undefined
    const top = index>0?-1+(-4*(index-1)):undefined

    return (
      <svg width="17" height="16" viewBox="0 0 17 16" style={{zIndex,top}}>
          <defs>
              <path id="a" d="M16.965 11c-.39 2.803-4.031 5-8.465 5S.425 13.803.035 11H0V6h.025c.334-3.356 4-6 8.475-6 4.474 0 8.141 2.644 8.475 6H17v5h-.035z"/>
              <mask id="d" width="17" height="16" x="0" y="0" fill="#fff">
                  <use xlinkHref="#a"/>
              </mask>
              <ellipse id="b" cx="8.5" cy="6.5" rx="8.5" ry="6.5"/>
              <mask id="e" width="17" height="13" x="0" y="0" fill="#fff">
                  <use xlinkHref="#b"/>
              </mask>
              <ellipse id="c" cx="8.5" cy="6.5" rx="4.5" ry="3.5"/>
              <mask id="f" width="9" height="7" x="0" y="0" fill="#fff">
                  <use xlinkHref="#c"/>
              </mask>
          </defs>
          <g fill="none" fillRule="evenodd" stroke="#535168">
              <use fill={primaryColor} strokeWidth="2" mask="url(#d)" xlinkHref="#a"/>
              <use fill="#fff" fillOpacity=".3" strokeWidth="2" mask="url(#e)" xlinkHref="#b"/>
              <path d="M1 6.5h15M3 10l11-7M14 10L3 3M8.5 1v11"/>
              <use fill={secondaryColor} strokeWidth="2" mask="url(#f)" xlinkHref="#c"/>
          </g>
      </svg>
    )
  }
}
