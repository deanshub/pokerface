// @flow
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { Container, Loader, Segment } from 'semantic-ui-react'
import NoMatch from '../../components/NoMatch'
import Logo from '../../components/Logo'
import Button from '../../components/basic/Button'
import Post from './Post'
import PhotoGallery from './PhotoGallery'
import classnames from 'classnames'
import style from './style.css'

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
    const { feed } = this.props
    const {loading, post} = feed.standalonePost

    return (
      <Container
          style={{width:'80vw', maxWidth: 'none'}}
          text
          textAlign="center"
      >
        <PhotoGallery/>
        <Segment basic>
          <a href="/" onClick={::this.goHome}>
            <Logo/>
          </a>
        </Segment>
        {
          loading?
          <Loader active inline="centered">Loading</Loader>
          :
          post?
            <Post
                post={post}
                standalone
            />
            :
            <NoMatch/>
        }
        {
          !loading&&
          <div className={classnames(style.signupContainer)}>
            <Button
                href={post?`/login?url=/post/${post.id}`:'/login'}
                primary
                style={{width:'30em', textTransform:'uppercase'}}
            >
              Join The Pokerface Community - Sign Up
            </Button>
          </div>
        }
      </Container>
    )
  }
}
