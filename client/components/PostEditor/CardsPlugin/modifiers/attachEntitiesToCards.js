//@flow
import { EditorState, Modifier, SelectionState } from 'draft-js'

import cardsBlockRegex from '../cardsRegex'


const findWithRegex = (regex, contentBlock, callback) => {
  // Get the text from the contentBlock
  const text = contentBlock.getText()
  let matchArr
  let start // eslint-disable-line
  // Go through all matches in the text and return the indizes to the callback
  while ((matchArr = regex.exec(text)) !== null) { // eslint-disable-line
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}


export default function(editorState){
  const contentState = editorState.getCurrentContent()
  const blocks = contentState.getBlockMap()
  let newContentState = contentState

  blocks.forEach((block) => {
    const plainText = block.getText()

    const addEntityToCards = (start, end) => {
      const existingEntityKey = block.getEntityAt(start)
      if (existingEntityKey) {
        // avoid manipulation in case the emoji already has an entity
        const entity = newContentState.getEntity(existingEntityKey)
        if (entity && entity.get('type') === 'card') {
          return
        }
      }

      const selection = SelectionState.createEmpty(block.getKey())
        .set('anchorOffset', start)
        .set('focusOffset', end)
      const cardsText = plainText.substring(start, end)
      const contentStateWithEntity = newContentState.createEntity('card', 'IMMUTABLE', { cardsText })
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

      newContentState = Modifier.replaceText(
        newContentState,
        selection,
        cardsText,
        null,
        entityKey,
      )
    }

    findWithRegex(cardsBlockRegex, block, addEntityToCards)
  })

  if (!newContentState.equals(contentState)) {
    return EditorState.push(
      editorState,
      newContentState,
      'convert-to-immutable-cards',
    )
  }

  return editorState
}
