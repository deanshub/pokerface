// @flow

import React, { Component, PropTypes } from 'react'
import { fromJS } from 'immutable'
import classnames from 'classnames'

import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createFocusPlugin from 'draft-js-focus-plugin'
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import createEmojiPlugin from 'draft-js-emoji-plugin'
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import createCardsPlugin from './CardsPlugin'

import style from './style.css'
import 'draft-js/dist/Draft.css'
import 'draft-js-focus-plugin/lib/plugin.css'
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'
import 'draft-js-mention-plugin/lib/plugin.css'
import 'draft-js-emoji-plugin/lib/plugin.css'
import 'draft-js-hashtag-plugin/lib/plugin.css'
import 'draft-js-linkify-plugin/lib/plugin.css'

const focusPlugin = createFocusPlugin()
const inlineToolbarPlugin = createInlineToolbarPlugin()
const { InlineToolbar } = inlineToolbarPlugin
const emojiPlugin = createEmojiPlugin()
const { EmojiSuggestions } = emojiPlugin
const mentionPlugin = createMentionPlugin()
const { MentionSuggestions } = mentionPlugin
const hashtagPlugin = createHashtagPlugin()
const linkifyPlugin = createLinkifyPlugin({
  target: '_blank',
})
const cardsPlugin = createCardsPlugin()

const plugins = [
  focusPlugin,
  inlineToolbarPlugin,
  emojiPlugin,
  mentionPlugin,
  hashtagPlugin,
  linkifyPlugin,
  cardsPlugin,
]

let mentions = fromJS([
  {
    name: 'Matthew Russell',
    link: 'https://twitter.com/mrussell247',
    avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
  },
  {
    name: 'Julian Krispel-Samsel',
    link: 'https://twitter.com/juliandoesstuff',
    avatar: 'https://avatars2.githubusercontent.com/u/1188186?v=3&s=400',
  },
  {
    name: 'Jyoti Puri',
    link: 'https://twitter.com/jyopur',
    avatar: 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
  },
  {
    name: 'Max Stoiber',
    link: 'https://twitter.com/mxstbr',
    avatar: 'https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_400x400.jpg',
  },
  {
    name: 'Nik Graf',
    link: 'https://twitter.com/nikgraf',
    avatar: 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400',
  },
  {
    name: 'Pascal Brandt',
    link: 'https://twitter.com/psbrandt',
    avatar: 'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
  },
])

export default class PostEditor extends Component {
  static defaultProps = {
    editorState: EditorState.createEmpty(),
    postEditor: false,
  }

  constructor(props){
    super(props)
    this.state = {
      suggestions: mentions,
    }
  }

  componentDidMount(){
    setTimeout(()=>{
      this.focus()
    })
  }
  focus() {
    // e.preventDefault()
    this.editor.focus()
  }

  onSearchChange({ value }) {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    })
  }

  onClose(){
    this.setState({
      suggestions: fromJS([]),
    })
  }

  onAddMention() {
    // get the mention object selected
  }

  render(){
    const { editorState, onChange, postEditor, placeholder } = this.props
    const { suggestions } = this.state

    return (
      <div
          className={classnames({
            [style.editor]: true,
            [style.post]: postEditor,
          })}
          onClick={::this.focus}
      >
        <Editor
            editorState={editorState}
            onChange={onChange}
            placeholder={placeholder}
            plugins={plugins}
            ref={(element) => {
              this.editor = element
              // if(element)
              //   element.focus()
            }}
        />
        <InlineToolbar/>
        <MentionSuggestions
            onAddMention={::this.onAddMention}
            onClose={::this.onClose}
            onSearchChange={::this.onSearchChange}
            suggestions={suggestions}
        />
        <EmojiSuggestions/>
      </div>
    )
  }
}
