// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { Header, Container, Icon, Loader } from 'semantic-ui-react'

import Post from './Post'

@inject('routing')
@inject('auth')
@inject('feed')
@observer
export default class StandalonePost extends Component {
  constructor(props: Object){
    super(props)
    this.state = {
      loading: true,
    }
  }

  componentDidMount(){
    const { match, feed } = this.props
    feed.getStandalonePost(match.params.id).then((post)=>{
      this.setState({
        post,
        loading: false,
      })
    }).catch((e)=>{
      this.setState({
        loading: false,
      })
    })
  }

  render() {
    const { post, loading } = this.state

    return (
      <Container text textAlign="center">
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
              <a href="/login">
                <Header
                    color="red"
                    size="huge"
                    style={{marginTop:20}}
                    textAlign="center"
                >
                    <Header.Content>Pokerface.io</Header.Content>
                </Header>
              </a>
              <Header size="huge">Post have been removed or is private...</Header>
              <Header size="bug">Login and try again</Header>
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
