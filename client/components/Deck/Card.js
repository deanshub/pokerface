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
    active: PropTypes.bool,
    activeHover: PropTypes.bool,
    clickable: PropTypes.bool,
    covered: PropTypes.bool,
    coveredText: PropTypes.string,
    inline: PropTypes.bool,
    noHoverEffect: PropTypes.bool,
    rank: PropTypes.string,
    suit: PropTypes.string,
  }
  static defaultProps = {
    activeHover: false,
    clickable: false,
    inline: false,
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
    this.bindedResetHight = this.resetHight.bind(this)
  }

  componentDidMount(){
    this.resetHight()
    window.addEventListener('resize', this.bindedResetHight)
  }

  componentDidUpdate(prevProps){
    const {covered} = this.props
    if (covered!==prevProps.covered){
      this.resetHight()
    }
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.bindedResetHight)
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
    const {rank, suit, covered, inline, noHoverEffect, active, style:customStyle} = this.props
    const {activeHover} = this.state
    const {originalHeight} = this.state

    const scale = 70/52*0.75
    const width = originalHeight&&`${(originalHeight/scale/20)}em`
    const fontSize = originalHeight&&`${!inline?scale*1.1:scale}em`

    const normalizedRank = normalizeRank(rank)
    const normalizedSuit = normalizeSuite(suit)
    let letterAttr = {
      'data-letter': `${normalizedRank.toUpperCase()}`,
    }
    let inlineImgStyle ={}
    if (!inline){
      letterAttr['data-reverse-letter'] = `${normalizedRank.toUpperCase()}`
    }else{
      inlineImgStyle.position='absolute'
      inlineImgStyle.justifyContent='flex-end'
      inlineImgStyle.alignItems = 'flex-end'
      inlineImgStyle.bottom = '2%'
      inlineImgStyle.right = '10%'
    }

    const redColored = SUITES[normalizedSuit]===SUITES.hearts||SUITES[normalizedSuit]===SUITES.diams
    const blackColored = SUITES[normalizedSuit]===SUITES.spades||SUITES[normalizedSuit]===SUITES.clubs

    return (
      <li
          className={classnames(
            style.card,
            {[style.activeHover]:activeHover},
            {[style.hover]:!noHoverEffect},
            {[style.active]:active},
            {[style.back]:covered},
            {[style.red]:redColored},
            {[style.black]:blackColored},
          )}
          onClick={::this.toggleCard}
          ref={(el)=>this.cardElement=el}
          style={{
            ...customStyle,
            visibility: width?'visible':'hidden',
            width,
            fontSize,
          }}
      >
        {this.getBackCard()}
        <div
          className={classnames(
            style.front,
            {[style.uncover]:!covered},
          )}
          {...letterAttr}
        >
          <img
              src={SVG_SUITES[normalizedSuit]}
              style={{width:'50%',height:'50%', ...inlineImgStyle}}
          />
        </div>
      </li>
    )
  }
}
