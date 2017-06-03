// @flow
import { EditorState } from 'draft-js'
import CardBlock from './CardBlock'
import cardsStrategy from './cardsStrategy'
import attachEntitiesToCards from './modifiers/attachEntitiesToCards'

export default () => {
  return {
    decorators: [
      {
        strategy: cardsStrategy,
        component: CardBlock,
      },
    ],
    onChange: (editorState) => {
      let newEditorState = attachEntitiesToCards(editorState)
      if (!newEditorState.getCurrentContent().equals(editorState.getCurrentContent())) {
      // Forcing the current selection ensures that it will be at it's right place.
      // This solves the issue where inserting an Emoji on OSX with Apple's Emoji
      // selector led to the right selection the data, but wrong position in
      // the contenteditable.
        newEditorState = EditorState.forceSelection(
          newEditorState,
          newEditorState.getSelection(),
        )
      }
      return newEditorState
    },
  }
}
