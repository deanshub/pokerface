import React, { Component } from 'react'
import YouTubeComp from 'react-youtube'
import PropTypes from 'prop-types'
import { parse } from 'qs'
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
    // event.target.pauseVideo()
  }
  nextSong(event){
    event.target.nextVideo()
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
      <YouTubeComp
          className={classnames(style.youtube)}
          onError={::this.nextSong}
          onReady={::this.onReady}
          opts={opts}
          videoId={videoId}
      />
    )
  }
}
