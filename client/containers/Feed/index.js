import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import classnames from 'classnames'
// import style from './style.css'
import { Feed, Container } from 'semantic-ui-react'
// import * as BoardActions from '../../ducks/board'


const events = [{
  date: '1 Minute Ago',
  image: 'http://semantic-ui.com/images/avatar/small/elliot.jpg',
  meta: '4 Likes',
  summary: 'Elliot Fu added you as a friend',
}, {
  date: '2 Hours Ago',
  image: 'http://semantic-ui.com/images/avatar/small/joe.jpg',
  meta: '14 Likes',
  summary: 'Joe Henderson posted on his page',
  extraText: 'Had the nuts in the all star poker game at the last hand!',
}, {
  date: '4 days ago',
  image: 'http://semantic-ui.com/images/avatar/small/helen.jpg',
  meta: '1 Like',
  summary: 'Helen Troy added 1 new photo',
  extraImages: [
    '/images/table.jpg',
  ],
}, {
  date: '3 days ago',
  image: 'http://semantic-ui.com/images/avatar/small/joe.jpg',
  meta: '8 Likes',
  summary: 'Joe Henderson posted on his page',
  extraText: 'Ours is a life of constant reruns. We\'re always circling back to where we\'d we started.',
}, {
  date: '4 days ago',
  image: 'http://semantic-ui.com/images/avatar/small/justen.jpg',
  meta: '41 Likes',
  summary: 'Justen Kitsune added 2 new photos of you',
  extraText: 'Look at these fun pics I found from a few years ago. Good times.',
  extraImages: [
    'http://semantic-ui.com/images/wireframe/image.png',
    'http://semantic-ui.com/images/wireframe/image.png',
  ],
}]

class FeedContainer extends Component {
  render() {
    // const { board, actions, children } = this.props

    return (
      <Container style={{marginTop:20}} text>
        <Feed events={events} />
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    // board: state.board,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // actions: bindActionCreators(BoardActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedContainer)
