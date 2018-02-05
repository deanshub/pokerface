import React, { Component } from 'react'
import YouTubeComp from 'react-youtube'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import Input from '../basic/Input'
import Button from '../basic/Button'
import classnames from 'classnames'
import style from './style.css'

export default class YouTube extends Component {
  static propTypes = {
    phrase: PropTypes.string,
  }

  static defaultProps = {
    phrase: 'https://www.youtube.com/watch?v=hTWKbfoikeg&list=PLA1D6023F6FF2684B',
    // phrase: 'https://www.youtube.com/watch?v=G_e707496Fg',
    // phrase: 'נמסטה',
  }

  constructor(props){
    super(props)
    this.state = this.analyzePhrase(props.phrase.substring(props.phrase.indexOf('?')+1))
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.width && nextProps.height){
      this.videoPlayer.setSize(nextProps.width, nextProps.height)
    }
    this.phraseChange(nextProps.phrase)
  }

  shouldComponentUpdate(){
    return false
  }

  analyzePhrase(phrase){
    const query = parse(phrase)

    if (query.list){
      return {
        listType: 'playlist',
        list: query.list,
        videoId: null,
      }
    }else if(query.v){
      return {
        listType: null,
        list: null,
        videoId: query.v,
      }
    }else{
      return {
        listType: 'search',
        list: phrase,
        videoId: null,
      }
    }
  }

  onReady(event){
    this.videoPlayer = event.target
  }
  nextSong(){
    this.videoPlayer.nextVideo()
  }

  phraseChange(phrase){
    if (this.props.phrase!==phrase){
      const playerVars = this.analyzePhrase(phrase)
      if (playerVars.videoId){
        this.videoPlayer.loadVideoById(playerVars.videoId)
      }else {
        this.videoPlayer.loadPlaylist(playerVars)
      }
    }
  }

  seachChange(e){
    this.inStatePhrase = e.target.value
  }

  submitSearch(e){
    e.preventDefault()
    this.phraseChange(this.inStatePhrase)
    this.videoPlayer.a.focus()
  }

  render(){
    const { videoId, ...playerVars } = this.state
    const { width, height } = this.props
    const opts = {
      width: width||'1500em',
      height: height||'800em',
      playerVars: {
        autoplay: 1,
        fs: 0,
        modestbranding: 1,
        loop:1,
        rel: 0,
        ...playerVars,
      },
    }

    return (
      <form onSubmit={::this.submitSearch}>
        <div className={classnames(style.searchContainer)}>
          <Input
              borderColor="#545454"
              className={classnames(style.search)}
              dir="auto"
              onChange={::this.seachChange}
              placeholder="YouTube link \ Search..."
              rightButton={
                <Button
                    small
                    type="submit"
                >
                  Serach
                </Button>
              }
          />
        </div>
        <YouTubeComp
            className={classnames(style.youtube)}
            onError={::this.nextSong}
            onReady={::this.onReady}
            opts={opts}
            videoId={videoId}
        />
      </form>
    )
  }
}
