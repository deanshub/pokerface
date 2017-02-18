import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import Cover from '../../components/Cover'
import ProfileNavbar from '../../components/ProfileNavbar'
// import Post from '../../components/Post'
import Feed from '../Feed'
// import * as BoardActions from '../../ducks/board'
import { observer, inject } from 'mobx-react'

@inject('auth')
@observer
export default class Profile extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
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
    const { auth } = this.props
    const { posts } = this.state

    return (
      <div className={classnames(style.container)}>
        <Cover
            image={auth.user.coverImage}
            title={auth.user.displayName}
        />
        <ProfileNavbar
            avatar={auth.user.avatarImage}
        />

        <Feed/>
      {/*posts.map((post, index)=><Post key={index} {...post}/>)*/}
      </div>
    )
  }
}
