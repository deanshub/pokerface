import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { AtomicBlockUtils, RichUtils } from 'draft-js'
import createVideoPlugin from 'draft-js-video-plugin'
const {types} = createVideoPlugin()

export default class AddVideoButton extends Component {
  static propTypes = {
    getEditorState: PropTypes.func,
    setEditorState: PropTypes.func,
    style: PropTypes.shape(),
    theme: PropTypes.shape(),
  }

  // toggleStyle(event){
  //   const { setEditorState, getEditorState, style } = this.props
  //
  //   event.preventDefault()
  //   setEditorState(
  //     RichUtils.toggleInlineStyle(
  //       getEditorState(),
  //       style
  //     )
  //   )
  // }

  toggleVideo(event){
    const { setEditorState, getEditorState } = this.props
    event.preventDefault()

    const style = { width: 100}

    const editorState = getEditorState()
    const currentContent = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()
    const anchorKey = selectionState.getAnchorKey()
    const currentContentBlock = currentContent.getBlockForKey(anchorKey)
    const start = selectionState.getStartOffset()
    const end = selectionState.getEndOffset()
    const src = currentContentBlock.getText().slice(start, end)

    if (RichUtils.getCurrentBlockType(editorState) === types.ATOMIC) {
      return editorState
    }
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      types.VIDEOTYPE,
      'IMMUTABLE',
      { src, style }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ')
    return setEditorState(newEditorState)
  }

  render(){
    const { theme, style, getEditorState } = this.props
    const styleIsActive = () => getEditorState().getCurrentInlineStyle().has(style)

    return (
      <div
          className={theme.buttonWrapper}
          onMouseDown={(e)=>e.preventDefault()}
      >
        <button
            className={classnames({
              [theme.active]:styleIsActive(),
              [theme.button]:true,
            })}
            onClick={::this.toggleVideo}
        >
          <svg height="24" viewBox="0 0 120 100" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M111.374,20.922c-3.151-3.159-7.557-5.128-12.374-5.125H29c-4.817-0.002-9.222,1.966-12.375,5.125  c-3.159,3.152-5.128,7.557-5.125,12.375v40.038c-0.002,4.818,1.966,9.223,5.125,12.375c3.152,3.158,7.557,5.129,12.375,5.125h70  c4.817,0.004,9.224-1.967,12.375-5.125c3.159-3.152,5.128-7.557,5.125-12.375V33.296C116.503,28.479,114.534,24.074,111.374,20.922z   M104.624,78.959c-1.454,1.447-3.413,2.328-5.624,2.33H29c-2.211-0.002-4.17-0.883-5.625-2.33c-1.447-1.455-2.328-3.414-2.33-5.625  V33.296c0.002-2.211,0.883-4.17,2.33-5.625c1.455-1.447,3.413-2.328,5.625-2.33h70c2.211,0.002,4.17,0.883,5.625,2.33  c1.447,1.455,2.327,3.413,2.329,5.625v40.038C106.952,75.545,106.072,77.504,104.624,78.959z" fill="#232323"/><path d="M77.519,50.744L57.45,39.161c-0.46-0.266-0.971-0.397-1.483-0.397c-0.513,0-1.023,0.131-1.484,0.397  c-0.918,0.528-1.483,1.509-1.483,2.569v23.171c0,1.061,0.565,2.04,1.483,2.57c0.46,0.267,0.971,0.396,1.484,0.396  c0.513,0,1.023-0.13,1.483-0.396l20.069-11.586c0.918-0.531,1.482-1.51,1.482-2.571C79.001,52.253,78.437,51.274,77.519,50.744z" fill="#232323"/>
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>
      </div>
    )
  }
}
