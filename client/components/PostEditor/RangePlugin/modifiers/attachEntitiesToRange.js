//@flow
import { EditorState, Modifier, SelectionState } from 'draft-js'

import rangeBlockRegex from '../rangeRegex'


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

const addEntityToRange = (start, end, block, plainText, newContentState) => {
  const existingEntityKey = block.getEntityAt(start)
  if (existingEntityKey) {
    // avoid manipulation in case the emoji already has an entity
    const entity = newContentState.getEntity(existingEntityKey)
    if (entity && entity.get('type') === 'range') {
      return null
    }
  }

  const blockKey = block.getKey()
  const selection = SelectionState.createEmpty(blockKey)
    .set('anchorOffset', start)
    .set('focusOffset', end)
  const rangeText = plainText.substring(start, end)
  const contentStateWithEntity = newContentState.createEntity('range', 'SEGMENTED', { rangeText })
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  newContentState = Modifier.replaceText(
    newContentState,
    selection,
    rangeText,
    null,
    entityKey,
  )

  const blockSize = block.getLength()
  if (end === blockSize) {
    newContentState = Modifier.insertText(
      newContentState,
      newContentState.getSelectionAfter(),
      ' ',
    )
  }
  return newContentState
}

export default function(editorState){
  const contentState = editorState.getCurrentContent()
  const blocks = contentState.getBlockMap()
  let newContentState = contentState

  blocks.forEach((block) => {
    const plainText = block.getText()
    findWithRegex(rangeBlockRegex, block, (start,end)=>{
      const contentStateWithEntities = addEntityToRange(start,end,block,plainText, newContentState)
      if (contentStateWithEntities){
        newContentState = contentStateWithEntities
      }
    })
  })

  if (!newContentState.equals(contentState)) {
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'convert-to-immutable-range',
    )
    return newEditorState
    // return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter())
  }

  return editorState
}
