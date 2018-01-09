import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Feed, Loader } from 'semantic-ui-react'
import Post from './Post'
import PhotoGallery from './PhotoGallery'
import AddPlay from '../../components/AddPlay'
import IsUserLoggedIn from '../../components/IsUserLoggedIn'
import classnames from 'classnames'
import style from './style.css'

@inject('feed')
@observer
export default class FeedContainer extends Component {
  constructor(props: Object){
    super(props)
    this.loadOnScroll = this.loadOnScroll.bind(this)
  }

  componentDidMount(){
    const { feed, by } = this.props
    feed.fetchPosts(by)
    window.addEventListener('scroll', this.loadOnScroll)
  }

  componentWillReceiveProps(props){
    const { feed, by } = props
    feed.fetchPosts(by)
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.loadOnScroll)
  }

  loadOnScroll(){
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 600){
      const { feed, by } = this.props
      feed.fetchPosts(by)
    }
  }

  render() {
    const { feed } = this.props

    return (
      <div className={classnames(style.container)}>
        <IsUserLoggedIn>
          <AddPlay />
        </IsUserLoggedIn>
        <div>
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
        </div>
    </div>
    )
  }
}
