import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import PostEditor from '../PostEditor'
import MediaPreview from './MediaPreview'
import SpotWizard from '../SpotWizard'
import SpotPlayer from '../../containers/SpotPlayer'
import classnames from 'classnames'
import style from './style.css'
import EventBlock from './EventBlock'
import ButtonsPanel from './ButtonsPanel'
// const shareWithOptions = [{
//   key: 'everyone',
//   text: 'Everyone',
//   value: 'public',
//   content: 'Everyone',
//   icon: 'world',
// },{
//   key: 'friends',
//   text: 'Friends',
//   value: 'friends',
//   content: 'Friends',
//   icon: 'users',
//   disabled: true,
// },{
//   key: 'private',
//   text: 'Private',
//   value: 'private',
//   content: 'Private',
//   icon: 'user',
//   disabled: true,
// }]

@inject('spotPlayer')
@inject('feed')
@observer
export default class AddPlay extends Component {
  deleteSpotPlayer(){
    const {spotPlayer} = this.props
    spotPlayer.newSpot = spotPlayer.initNewPost()
  }

  render() {
    const {feed, spotPlayer} = this.props
    const hasSpot = spotPlayer.newSpot.spot.moves.length>0

    return (
      <div>
        <div className={classnames(style.info)}>
          @ - tag friends  [] - insert cards  : - insert emoji
        </div>
        <div className={classnames(style.addPostContent)}>
          {
            hasSpot?(
              <div className={classnames(style.spotWPreview)}>
                <SpotPlayer post={spotPlayer.newSpot} style={{height:'40em',minHeight:'40vw', backgroundColor:'white'}}/>
                <div
                    className={classnames(style.spotPreviewOverlay)}
                    onClick={::this.deleteSpotPlayer}
                >
                  <div className={classnames(style.deleteImage)}/>
                </div>
              </div>
            ):null
          }
          <PostEditor
              placeholder="Share something"
              post={feed.newPost}
              postEditor
          />

          <MediaPreview/>
          <EventBlock/>
          <ButtonsPanel/>
          <SpotWizard/>
        </div>
      </div>
    )
  }
}
