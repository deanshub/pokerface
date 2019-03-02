// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { observer, inject } from 'mobx-react'

import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor'

// import createFocusPlugin from 'draft-js-focus-plugin'
import createInlineToolbarPlugin, {Separator}  from 'draft-js-inline-toolbar-plugin'
import createMentionPlugin from 'draft-js-mention-plugin'
import PlayerMention from './PlayerMention'
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import createVideoPlugin from 'draft-js-video-plugin'
import createCardsPlugin from './CardsPlugin'
import createRangePlugin from './RangePlugin'
import createEmojiPlugin from 'draft-js-emoji-plugin'

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
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
// import 'draft-js-focus-plugin/lib/plugin.css'
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'
import 'draft-js-mention-plugin/lib/plugin.css'
import 'draft-js-emoji-plugin/lib/plugin.css'
import 'draft-js-hashtag-plugin/lib/plugin.css'
import 'draft-js-linkify-plugin/lib/plugin.css'
import 'draft-js-video-plugin/lib/plugin.css'

import SpotPlayer from '../../containers/SpotPlayer'
import Poll from '../Poll'

@inject('spotPlayer')
@inject('feed')
@inject('globalPlayersSearch')
@inject('auth')
@observer
class PostEditor extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    post: PropTypes.shape().isRequired,
    postEditor: PropTypes.bool,
    readOnly: PropTypes.bool,
    standalone: PropTypes.bool,
  }

  static defaultProps = {
    autoFocus: false,
    postEditor: false,
    readOnly: false,
    standalone: false,
  }

  constructor(props){
    super(props)
    // const focusPlugin = createFocusPlugin()
    const inlineToolbarPlugin = createInlineToolbarPlugin()
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
    const rangePlugin = createRangePlugin()

    this.plugins = [
      // focusPlugin,
      inlineToolbarPlugin,
      mentionPlugin,
      hashtagPlugin,
      linkifyPlugin,
      videoPlugin,
      cardsPlugin,
      rangePlugin,
      emojiPlugin,
    ]
    this.InlineToolbar = InlineToolbar
    this.EmojiSuggestions = EmojiSuggestions
    this.MentionSuggestions= MentionSuggestions

    if (props.post.content===undefined){
      props.post.content = createEditorStateWithText('')
    }
  }

  componentDidMount(){
    const {autoFocus} = this.props
    if (autoFocus){
      setTimeout(()=>{
        this.focus()
      })
    }
  }

  focus() {
    const { readOnly } = this.props
    if (this.editor && !readOnly){
      try{
        this.editor.focus()
      }catch(e){
        console.log('can\'t focus')
      }
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

  postContentChange(editorState){
    const {auth, feed, post, spotPlayer} = this.props
    feed.updatePost(post ,{content: editorState}, spotPlayer, auth.user)
  }

  pollOptionSelected(option){
    const {feed, post} = this.props
    feed.updatePollAnswer(post.id, option)
  }

  refEditor(element){
    if (element && !this.editor){
      this.editor = element
    }
  }

  render(){
    const {
      post,
      postEditor,
      placeholder,
      readOnly,
      globalPlayersSearch,
      standalone,
    } = this.props
    const {
      plugins,
      InlineToolbar,
      EmojiSuggestions,
      MentionSuggestions,
    } = this

    return (
      <div
          className={classnames(style.container,{
            [style.editor]: !readOnly,
            [style.post]: postEditor,
          })}
          onClick={::this.focus}>
        <Editor
            editorState={post.content}
            onChange={::this.postContentChange}
            placeholder={placeholder}
            plugins={plugins}
            readOnly={readOnly}
            ref={::this.refEditor}
        />
        <EmojiSuggestions/>
        <InlineToolbar>
          {(externalProps) => (
            <div>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <CodeButton {...externalProps} />
              <Separator {...externalProps} />
              <AddVideoButton {...externalProps} />
            </div>
            )}
        </InlineToolbar>
        <MentionSuggestions
            onAddMention={::this.onAddMention}
            onClose={::this.onClose}
            onSearchChange={::this.onSearchChange}
            suggestions={globalPlayersSearch.immutableAvailablePlayers}
        />
        {
          post.poll&&
          <Poll
              answers={post.poll.answers}
              id={post.id}
              onSelect={::this.pollOptionSelected}
              readOnly={readOnly}
          />
        }
        {
          post.spot?(
            <SpotPlayer
                post={post}
                standalone={standalone}
                style={{height:'40em',minHeight:'40vw'}}
            />
          ):null
        }
      </div>
    )
  }
}
export default PostEditor
