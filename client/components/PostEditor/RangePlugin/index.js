// @flow
// import { EditorState } from 'draft-js'
import RangeBlock from './RangeBlock'
import rangeStrategy from './rangeStrategy'
// import attachEntitiesToRange from './modifiers/attachEntitiesToRange'

export default () => {
  return {
    decorators: [
      {
        strategy: rangeStrategy,
        component: RangeBlock,
      },
    ],
    // onChange: (editorState) => {
    //   let newEditorState = attachEntitiesToRange(editorState)
    //   if (!newEditorState.getCurrentContent().equals(editorState.getCurrentContent())) {
    //   // Forcing the current selection ensures that it will be at it's right place.
    //   // This solves the issue where inserting an Emoji on OSX with Apple's Emoji
    //   // selector led to the right selection the data, but wrong position in
    //   // the contenteditable.
    //     newEditorState = EditorState.forceSelection(
    //       newEditorState,
    //       newEditorState.getSelection(),
    //     )
    //   }
    //   return newEditorState
    // },
  }
}
