// @flow
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { Header, Container, Icon, Loader, Segment } from 'semantic-ui-react'
import Logo from '../../components/Logo'
import Post from './Post'

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
            <div>
              <Header size="huge">Post has been removed or is private...</Header>
              <Header>Login and try again</Header>
              <a href="/">
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
