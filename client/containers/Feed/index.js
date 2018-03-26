import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Loader from '../../components/basic/Loader'
import Post from './Post'
import PhotoGallery from './PhotoGallery'
import AddPost from '../AddPost'
import IsUserLoggedIn from '../../components/IsUserLoggedIn'
import ResponsiveContainer from '../../components/ResponsiveContainer'
import StickyNotification from './StickyNotification'
import classnames from 'classnames'
import style from './style.css'


@inject('feed')
@inject('auth')
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

  pushNewReceivedPost(){
    this.props.feed.pushNewReceivedPost()
    window.scrollTo(0, 0)
  }

  render() {
    const { auth, feed } = this.props
    const { newReceivedPosts } = feed

    return (
      <ResponsiveContainer
          desktopClassName={classnames(style.container)}
          mobileClassName={classnames(style.mobileContainer)}
          sticky
      >
        <IsUserLoggedIn>
          <React.Fragment>
            <StickyNotification onClick={::this.pushNewReceivedPost} postsCount={newReceivedPosts.size}/>
            <AddPost theme={auth.theme}/>
          </React.Fragment>
        </IsUserLoggedIn>
        <div>
          {feed.parsedPosts.map(post=>(
            <Post
                key={post.id}
                post={post}
                theme={auth.theme}
            />
          ))}
          {feed.loading?
            <Loader compact/>
          :
            null
          }
          <PhotoGallery/>
        </div>
      </ResponsiveContainer>
    )
  }
}
