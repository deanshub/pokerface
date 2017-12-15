import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'
import {SUITES, SVG_SUITES, normalizeSuite, normalizeRank} from './consts'
import logo from '../../assets/logo.png'

//TODO: take care of joker card
//TODO: take care of clickable cards

export default class Card extends PureComponent {
  static propTypes = {
    activeHover: PropTypes.bool,
    clickable: PropTypes.bool,
    covered: PropTypes.bool,
    coveredText: PropTypes.string,
    noHoverEffect: PropTypes.bool,
    rank: PropTypes.string,
    suit: PropTypes.string,
  }
  static defaultProps = {
    activeHover: false,
    clickable: false,
    covered: true,
    coveredText: 'Poker face',
    noHoverEffect: false,
    coveredLogo: logo,
  }

  constructor(props){
    super(props)
    this.state={
      originalHeight: null,
      activeHover: false,
    }
  }

  componentDidMount(){
    this.resetHight()
  }

  componentDidUpdate(prevProps){
    const {covered} = this.props
    if (covered!==prevProps.covered){
      this.resetHight()
    }
  }

  resetHight(){
    const originalHeight = parseInt(getComputedStyle(this.cardElement).height)
    this.setState({
      originalHeight,
    })
  }

  getBackCard(){
    const {coveredText, coveredLogo} = this.props
    return (
      <div className={classnames(style.backContainer)}>
        <div className={classnames(style.backLogo)} style={{backgroundImage:`url(${coveredLogo})`}}/>
        {/* <div className={classnames(style.backText)}>{coveredText}</div> */}
      </div>
    )
  }

  toggleCard(){
    const {clickable} = this.props
    if (clickable){
      this.setState({activeHover: !this.state.activeHover})
    }
  }

  render() {
    const {rank, suit, covered, coveredText, noHoverEffect, active, style:customStyle} = this.props
    const {activeHover} = this.state
    const {originalHeight} = this.state

    const scale = 70/52
    const width = originalHeight&&(originalHeight/scale)
    const fontSize = originalHeight&&`${scale*0.75}em`

    const normalizedRank = normalizeRank(rank)
    const normalizedSuit = normalizeSuite(suit)
    const letterAttr = {
      'data-letter': `${normalizedRank.toUpperCase()}`,
      'data-reverse-letter': `${normalizedRank.toUpperCase()}`,
    }

    return (
      <li
          className={classnames(
            style.card,
            {[style.activeHover]:activeHover},
            {[style.hover]:!noHoverEffect},
            {[style.active]:active},
            {[style.back]:covered},
            {[style.red]:SUITES[normalizedSuit]===SUITES.hearts||SUITES[normalizedSuit]===SUITES.diams},
            {[style.black]:SUITES[normalizedSuit]===SUITES.spades||SUITES[normalizedSuit]===SUITES.clubs}
          )}
          onClick={::this.toggleCard}
          ref={(el)=>this.cardElement=el}
          style={{
            ...customStyle,
            visibility: width?'visible':'hidden',
            width,
            fontSize,
          }}
          {...letterAttr}
      >
          {covered?
            this.getBackCard()
            :
            <img
                src={SVG_SUITES[normalizedSuit]}
                style={{width:'50%',height:'50%'}}
            />
          }
      </li>
    )
  }
}
