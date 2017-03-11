// @flow

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Navbar extends Component {
  static propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
  }

  constructor(props){
    super(props)
    this.state = {
      postImage: undefined,
    }
  }

  componentDidMount(){
    const {image} = this.props
    if (image){
      import(`../../assets/images/${image}`).then(postImage=>{
        this.setState({
          postImage,
        })
      })
    }
  }

  render() {
    const {title} = this.props
    const {postImage} = this.state

    return (
      <article className={classnames(style.container)}>
        <div className={classnames(style.title)}>
            {title}
        </div>
        {postImage?<img className={classnames(style.image)} src={postImage} />:undefined}
      </article>
    )
  }
}
