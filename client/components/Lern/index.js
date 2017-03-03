import React, { Component, PropTypes } from 'react'
import { Container } from 'semantic-ui-react'
// import classnames from 'classnames'
// import style from './style.css'
import UnavailableSection from '../UnavailableSection'
import Cards from '../Deck/Cards'
import {randomSuit, randomRank} from '../Deck/consts'

export default class Lern extends Component {
  // static propTypes = {
  // }

  // constructor(props){
  //   super(props)
  //   this.state = {
  //     postImage: undefined,
  //   }
  // }
// className={classnames(style.title)}
  render() {
    const cards = Array.from(Array(2)).map(()=>{
      return {rank: randomRank(), suit: randomSuit()}
    })

    return (
      <Container text>
        <UnavailableSection/>
        <Cards
            cards={cards}
            hand
            rotate
        />
      </Container>
    )
  }
}
