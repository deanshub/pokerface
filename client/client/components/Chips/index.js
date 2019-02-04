import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'

export default class Chips extends Component {
  static propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    multiple: PropTypes.bool,
    primaryColor: PropTypes.string,
    rotated: PropTypes.bool,
    seconderyColor: PropTypes.string,
    size: PropTypes.number,
    text: PropTypes.string,
  }

  static defaultProps = {
    amount: 5,
    currency: '$',
    multiple: false,
    rotated: false,
    primaryColor: '#045acc',
    seconderyColor: '#ffffff',
    text: 'Pokerface.io',
  }

  render() {
    const {rotated, size, text, currency, amount, multiple, primaryColor, seconderyColor} = this.props
    const small = size<300
    const chipColorsStyle = {
      backgroundColor: primaryColor,
      boxShadow: `0px 0px 0px 1px ${primaryColor}`,
      color: seconderyColor,
      borderColor: seconderyColor,
    }

    const regularChip = (
      <div
          className={
            classnames({
              [style.chip]: true,
              [style.firstLayer]: rotated,
              [style.smallChip]:small,
            })
          }
          style={{width: size, height: size, ...chipColorsStyle}}
      >
        {
          multiple?(
            <div className={classnames(style.multiple)} style={chipColorsStyle}/>
          ):null
        }
        {
          !small?(
            <div className={classnames(style.topRow)}>{text}</div>
          ):null
        }
        <div className={classnames(style.bottomRow)}>{amount}{currency}</div>
        <div className={classnames(style.innerDashes)} style={{borderColor: seconderyColor}}/>
      </div>
    )

    if (!rotated){
      return (
        regularChip
      )
    }

    const rotatedChip = (
      <div className={classnames(style.chip3d)}>
        {regularChip}
        <div className={classnames(style.secondLayer)} />
      </div>
    )

    return rotatedChip
  }
}
