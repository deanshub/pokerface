import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
// import classnames from 'classnames'
// import style from './style.css'
import { Feed, Container } from 'semantic-ui-react'
import Post from './post'

@inject('feed')
@observer
export default class FeedContainer extends Component {
  componentDidMount(){
    const { feed } = this.props
    feed.fetchEvents()
  }

  render() {
    const { feed } = this.props

    return (
      <Container style={{marginTop:20}} text>
        <Feed>
          {feed.events.map(post=><Post key={post.id} post={post}/>)}
        </Feed>
      </Container>
    )
  }
}
