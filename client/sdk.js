// import 'intl'
// import 'intl/locale-data/jsonp/en'
import React from 'react'
import ReactDOM from 'react-dom'
import StandalonePost from './containers/Feed/StandalonePost'
import { Provider } from 'mobx-react'
import './general.css'

import { RouterStore } from 'mobx-react-router'
import {AuthStore} from './store/AuthStore'
// import {EditEventStore} from './store/EditEventStore'
// import {PlayersStore} from './store/PlayersStore'
// import {ProfileStore} from './store/ProfileStore'
// import {TimerStore} from './store/TimerStore'
import {FeedStore} from './store/FeedStore'
import {PhotoGalleryStore} from './store/PhotoGalleryStore'
import {PlayersSearchStore} from './store/PlayersSearchStore'
// import {EventStore} from './store/EventStore'
import {SpotPlayerStore} from './store/SpotPlayerStore'
import {THEMES} from './constants/userSettings'

const renderPost = function(el, postId){
  const stores = {
    routing: new RouterStore(),
    auth: new AuthStore(THEMES[1]),
    feed: new FeedStore(),
    photoGallery: new PhotoGalleryStore(),
    globalPlayersSearch: new PlayersSearchStore(),
    spotPlayer: new SpotPlayerStore(),
  }
  return new Promise((resolve)=>{
    const params = {params:{id:postId}}
    ReactDOM.render(
      (
        <Provider {...stores}>
          <StandalonePost match={params} simple/>
        </Provider>
      ),
      el,
      ()=>{
        resolve(postId)
      }
    )
  })
}

// const renderPostComments = (el, postId)=>{}
// const renderSpot = (el, postId)=>{}
// const renderSpotGif = (el, postId)=>{}
// const renderPostEditor = (el, postId)=>{}

const pokerface = {
  renderPost,
}

module.exports = pokerface
