import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Loader from '../../components/basic/Loader'
import Post from './Post'
import PhotoGallery from './PhotoGallery'
import AddPlay from '../../components/AddPlay'
import IsUserLoggedIn from '../../components/IsUserLoggedIn'
import ResponsiveContainer from '../../components/ResponsiveContainer'
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
      <ResponsiveContainer
          desktopClassName={classnames(style.container)}
          mobileClassName={classnames(style.mobileContainer)}
      >
        <IsUserLoggedIn>
          <AddPlay />
        </IsUserLoggedIn>
        <div>
            {feed.parsedPosts.map(post=><Post key={post.id} post={post}/>)}
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
