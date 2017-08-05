// @flow

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { observer, inject } from 'mobx-react'

import { EditorState, convertToRaw } from 'draft-js'
import Editor from 'draft-js-plugins-editor'

import CardsPreview from './CardsPreview'

import createFocusPlugin from 'draft-js-focus-plugin'
import createInlineToolbarPlugin, {Separator}  from 'draft-js-inline-toolbar-plugin'
import createMentionPlugin from 'draft-js-mention-plugin'
import PlayerMention from './PlayerMention'
import createEmojiPlugin from 'draft-js-emoji-plugin'
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import createVideoPlugin from 'draft-js-video-plugin'
import createCardsPlugin from './CardsPlugin'

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  // HeadlineOneButton,
  // HeadlineTwoButton,
  // HeadlineThreeButton,
  // UnorderedListButton,
  // OrderedListButton,
  // BlockquoteButton,
  // CodeBlockButton,
} from 'draft-js-buttons'
import AddVideoButton from './AddVideoButton'

import style from './style.css'
import 'draft-js/dist/Draft.css'
import 'draft-js-focus-plugin/lib/plugin.css'
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'
import 'draft-js-mention-plugin/lib/plugin.css'
import 'draft-js-emoji-plugin/lib/plugin.css'
import 'draft-js-hashtag-plugin/lib/plugin.css'
import 'draft-js-linkify-plugin/lib/plugin.css'
import 'draft-js-video-plugin/lib/plugin.css'

@inject('globalPlayersSearch')
@observer
export default class PostEditor extends Component {
  static propTypes = {
    editorState: PropTypes.shape(),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    postEditor: PropTypes.bool,
    readOnly: PropTypes.bool,
  }

  static defaultProps = {
    editorState: EditorState.createEmpty(),
    postEditor: false,
    readOnly: false,
  }

  constructor(props){
    super(props)
    const focusPlugin = createFocusPlugin()
    const inlineToolbarPlugin = createInlineToolbarPlugin({
      structure: [
        BoldButton,
        ItalicButton,
        UnderlineButton,
        CodeButton,
        Separator,
        AddVideoButton,
      ],
    })
    const { InlineToolbar } = inlineToolbarPlugin
    const emojiPlugin = createEmojiPlugin()
    const { EmojiSuggestions } = emojiPlugin
    const mentionPlugin = createMentionPlugin({
      mentionComponent: PlayerMention,
    })
    const { MentionSuggestions } = mentionPlugin
    const hashtagPlugin = createHashtagPlugin()
    const linkifyPlugin = createLinkifyPlugin({
      target: '_blank',
    })
    const videoPlugin = createVideoPlugin()
    const cardsPlugin = createCardsPlugin()

    this.plugins = [
      focusPlugin,
      inlineToolbarPlugin,
      emojiPlugin,
      mentionPlugin,
      hashtagPlugin,
      linkifyPlugin,
      videoPlugin,
      cardsPlugin,
    ]
    this.InlineToolbar = InlineToolbar
    this.EmojiSuggestions =EmojiSuggestions
    this.MentionSuggestions= MentionSuggestions
  }

  componentDidMount(){
    setTimeout(()=>{
      this.focus()
    })
  }

  focus() {
    const { readOnly } = this.props
    if (this.editor && !readOnly){
      this.editor.focus()
    }
  }

  onSearchChange({ value }) {
    const {globalPlayersSearch} = this.props
    globalPlayersSearch.search(value)
  }

  onClose(){
    const { globalPlayersSearch } = this.props
    globalPlayersSearch.availablePlayers = []
  }

  onAddMention() {
    // get the mention object selected
  }

  getCardEntities(content){
    return Object.keys(content.entityMap)
      .filter((entityKey)=>content.entityMap[entityKey].type==='card')
      .map(entityKey=>content.entityMap[entityKey].data.cardsText)
  }

  render(){
    const { editorState, onChange, postEditor, placeholder, readOnly, globalPlayersSearch } = this.props
    const { InlineToolbar, EmojiSuggestions, MentionSuggestions} = this
    const cardEntities = this.getCardEntities(convertToRaw(editorState.getCurrentContent()))

    return (
      <div
          className={classnames({
            [style.editor]: !readOnly,
            [style.post]: postEditor,
          })}
          onClick={::this.focus}
      >
        <Editor
            editorState={editorState}
            onChange={onChange}
            placeholder={placeholder}
            plugins={this.plugins}
            readOnly={readOnly}
            ref={(element) => {
              if (element)
                this.editor = element
            }}
        />
        <InlineToolbar/>
        <MentionSuggestions
            onAddMention={::this.onAddMention}
            onClose={::this.onClose}
            onSearchChange={::this.onSearchChange}
            suggestions={globalPlayersSearch.immutableAvailablePlayers}
        />
        <EmojiSuggestions/>
        <CardsPreview cards={cardEntities}/>
      </div>
    )
  }
}
