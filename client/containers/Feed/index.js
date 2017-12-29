import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Feed, Container, Loader } from 'semantic-ui-react'
import Post from './Post'
import PhotoGallery from './PhotoGallery'
import AddPlay from '../../components/AddPlay'
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
    feed.fetchPosts(username)
    window.addEventListener('scroll', this.loadOnScroll)
  }

  componentWillReceiveProps(props){
    const { feed, username } = props
    feed.fetchPosts(username)
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.loadOnScroll)
  }

  loadOnScroll(){
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 600){
      const { feed, username } = this.props
      feed.fetchPosts(username)
    }
  }

  render() {
    const { feed } = this.props

    return (
      <Container
          fluid
          style={{marginTop:30}}
      >
        <AddPlay />
        <Container
            style={{marginTop:60}}
        >
          <Feed>
            {feed.parsedPosts.map(post=><Post key={post.id} post={post}/>)}
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
    </Container>
    )
  }
}
