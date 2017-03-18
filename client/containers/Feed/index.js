import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Feed, Container, Loader } from 'semantic-ui-react'
import Post from './Post'
import PhotoGallery from './PhotoGallery'
// import classnames from 'classnames'
// import style from './style.css'

@inject('feed')
@observer
export default class FeedContainer extends Component {
  constructor(props: Object){
    super(props)
    this.loadOnScroll = this.loadOnScroll.bind(this)
  }

  componentDidMount(){
    const { feed, username } = this.props
    feed.fetchEvents(username)
    window.addEventListener('scroll', this.loadOnScroll)
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.loadOnScroll)
  }

  loadOnScroll(){
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 600){
      const { feed, username } = this.props
      feed.fetchEvents(username)
    }
  }

  render() {
    const { feed } = this.props

    return (
      <Container
          style={{marginTop:20}}
          text
      >
        <Feed>
          {feed.events.map(post=><Post key={post.id} post={post}/>)}
          {feed.loading?
            <Feed.Event>
               <Loader active inline="centered">Loading</Loader>
            </Feed.Event>
          :
            null
          }
        </Feed>
        <PhotoGallery/>
      </Container>
    )
  }
}
