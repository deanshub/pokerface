import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Feed, Container } from 'semantic-ui-react'
import Post from './Post'
import PhotoGallery from './PhotoGallery'

@inject('feed')
@observer
export default class FeedContainer extends Component {
  componentDidMount(){
    const { feed } = this.props
    feed.fetchEvents()
  }

  render() {
    const { feed } = this.props

    return (
      <Container style={{marginTop:20}} text>
        <Feed>
          {feed.events.map(post=><Post key={post.id} post={post}/>)}
        </Feed>
        <PhotoGallery/>
      </Container>
    )
  }
}
