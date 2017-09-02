// @flow
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { Header, Container, Icon, Loader } from 'semantic-ui-react'
// import classnames from 'classnames'
// import style from './style.css'

import Post from './Post'

@inject('routing')
@inject('auth')
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
        <div>
          <a href="/" onClick={::this.goHome}>
            <Header
                color="red"
                size="huge"
                style={{marginTop:20}}
                textAlign="center"
            >
                <Header.Content>Pokerface.io</Header.Content>
            </Header>
          </a>
        </div>
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
            <div>
              <Header size="huge">Post have been removed or is private...</Header>
              <Header>Login and try again</Header>
              <a href="/login">
                <Icon
                    color="red"
                    link
                    name="home"
                    size="massive"
                />
              </a>
            </div>
        }
      </Container>
    )
  }
}
