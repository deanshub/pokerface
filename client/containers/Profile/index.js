import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import style from './style.css'
import Cover from '../../components/Cover'
import ProfileNavbar from '../../components/ProfileNavbar'
import Post from '../../components/Post'
// import * as BoardActions from '../../ducks/board'

class Feed extends Component {
  static propTypes = {
    login: PropTypes.object.isRequired,
  }
  constructor(props){
    super(props)
    this.state = {
      posts: [],
    }
  }

  componentDidMount(){
    this.setState({
      posts: [{
        by: 'Dean Shub',
        date: new Date(),
        title:'Winning 100$ with Ad and 2h',
      },{
        by: 'Dean Shub',
        date: new Date(),
        title:'Here comes the shark',
        image:'table.jpg',
      }],
    })
  }

  render() {
    const { login } = this.props
    const { posts } = this.state

    return (
      <div className={classnames(style.container)}>
        <Cover
            image={login.user.coverImage}
            title={login.user.displayName}
        />
        <ProfileNavbar
            avatar={login.user.avatarImage}
        />
        {posts.map((post, index)=><Post key={index} {...post}/>)}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
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
)(Feed)
