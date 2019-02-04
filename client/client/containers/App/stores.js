import { RouterStore } from 'mobx-react-router'

import {AuthStore} from '../../store/AuthStore'
import {EditEventStore} from '../../store/EditEventStore'
import {PlayersStore} from '../../store/PlayersStore'
import {ProfileStore} from '../../store/ProfileStore'
import {TimerStore} from '../../store/TimerStore'
import {FeedStore} from '../../store/FeedStore'
import {PhotoGalleryStore} from '../../store/PhotoGalleryStore'
import {PlayersSearchStore} from '../../store/PlayersSearchStore'
import {EventStore} from '../../store/EventStore'
import {SpotPlayerStore} from '../../store/SpotPlayerStore'

export default {
  routing: new RouterStore(),
  auth: new AuthStore(),
  editEvent: new EditEventStore(),
  players: new PlayersStore(),
  profile: new ProfileStore(),
  timer: new TimerStore(),
  feed: new FeedStore(),
  photoGallery: new PhotoGalleryStore(),
  globalPlayersSearch: new PlayersSearchStore(),
  events: new EventStore(),
  spotPlayer: new SpotPlayerStore(),
}