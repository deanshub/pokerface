import cardsBlockRegex from './cardsRegex'

export default (contentBlock: Object, callback: Function)=>{
  const text = contentBlock.getText()
  let cards = cardsBlockRegex.exec(text)
  while (typeof cards !== 'undefined' && cards !== null) {
    const start = cards.index
    callback(start, start + cards[0].length)
    cards = cardsBlockRegex.exec(text)
  }
}
