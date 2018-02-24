import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Sticky } from 'react-sticky'
import Loader from '../../components/basic/Loader'
import Post from './Post'
import PhotoGallery from './PhotoGallery'
import AddPlay from '../../components/AddPlay'
import IsUserLoggedIn from '../../components/IsUserLoggedIn'
import Notification from '../../components/Notification'
import ResponsiveContainer from '../../components/ResponsiveContainer'
import IsMobile from '../../components/IsMobile'
import { paddingTop, paddingTopMobile } from '../../constants/styles.css'
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

  pushNewReceivedPost(){
    this.props.feed.pushNewReceivedPost()
    window.scrollTo(0, 0)
  }

  render() {
    const { feed } = this.props
    const { newReceivedPosts } = feed

    const StickyNotification = () => (
      <Sticky topOffset={-80}>
      {
        ({style:localStyle}) => {
          return (
            <IsMobile
                render={(isMobile) => {
                  const top = isMobile?paddingTopMobile:paddingTop
                  const notificationClass = isMobile?style.notificationMobile:style.notification
                  return (
                    <header
                        className={classnames(style.sticky)}
                        style={{...localStyle, width:'inherit', top}}
                    >
                      <Notification
                          className={classnames(notificationClass)}
                          label="New Posts"
                          number={newReceivedPosts.size}
                          onClick={::this.pushNewReceivedPost}
                      />
                    </header>
                  )
                }}
            />
          )
        }
      }
      </Sticky>
    )

    return (
      <ResponsiveContainer
          desktopClassName={classnames(style.container)}
          mobileClassName={classnames(style.mobileContainer)}
          sticky
      >
        <StickyNotification/>
        <IsUserLoggedIn>
          <React.Fragment>
            <AddPlay />
          </React.Fragment>
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
