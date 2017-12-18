import rangeBlockRegex from './rangeRegex'

export default (contentBlock: Object, callback: Function)=>{
  const text = contentBlock.getText()
  let range = rangeBlockRegex.exec(text)
  while (typeof range !== 'undefined' && range !== null) {
    const start = range.index
    callback(start, start + range[0].length)
    range = rangeBlockRegex.exec(text)
  }
}
