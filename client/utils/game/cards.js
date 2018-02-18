import {cardRegex} from '../../components/PostEditor/CardsPlugin/cardsRegex'

export function stringToCards(cardsString){
  let cards = []
  let matchArr
  while ((matchArr = cardRegex.exec(cardsString)) !== null) {
    cards.push({
      rank: matchArr[2],
      suit: matchArr[3],
    })
  }
  return cards
}
