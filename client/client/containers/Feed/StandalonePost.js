// @flow
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import NoMatch from '../../components/NoMatch'
import Logo from '../../components/Logo'
import Button from '../../components/basic/Button'
import Loader from '../../components/basic/Loader'
import ResponsiveContainer from '../../components/ResponsiveContainer'
import IsUserLoggedIn from '../../components/IsUserLoggedIn'
import Post from './Post'
import PhotoGallery from './PhotoGallery'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('routing')
@inject('feed')
@observer
export default class StandalonePost extends Component {
  componentDidMount(){
    const { match, feed } = this.props
    feed.fetchStandalonePost(match.params.id)
    ReactDOM.findDOMNode(this).style.setProperty('max-width','none','important')
  }

  goHome(event){
    event.preventDefault()
    const { routing } = this.props
    routing.push('/')
  }

  render() {
    const {auth, feed, simple} = this.props
    const {loading, post} = feed.standalonePost
    const {theme} = auth
    return (
      <ResponsiveContainer
          desktopClassName={classnames(style.standaloneContainer)}
          mobileClassName={classnames(style.mobileStandaloneContainer)}
      >
        <PhotoGallery/>
        {!simple&&
          <div>
            <a href="/" onClick={::this.goHome}>
              <Logo theme={theme}/>
            </a>
          </div>
        }
        {
          loading?
          <Loader/>
          :
          post?
            <Post
                post={post}
                standalone
            />
            :
            <NoMatch/>
        }
        {!simple&&(
          <IsUserLoggedIn opposite>
            <div className={classnames(style.signupContainer)}>
              <Button
                href={post?`/login?url=/post/${post.id}`:'/login'}
                primary
                style={{width:'30em', textTransform:'uppercase'}}
                >
                  Join The Pokerface Community - Sign Up
                </Button>
              </div>
            </IsUserLoggedIn>
        )}
        {!simple&&(
          <IsUserLoggedIn>
            <div className={classnames(style.signupContainer)}>
              <Button
                  href="/"
              >
                Back to the feed
              </Button>
            </div>
          </IsUserLoggedIn>
        )}
      </ResponsiveContainer>
    )
  }
}