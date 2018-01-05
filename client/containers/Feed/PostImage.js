// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import Video from '../../components/basic/Video'
import classnames from 'classnames'
import style from './style.css'


export default class PostImage extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    // photo: PropTypes.string,
  }

  constructor(props: Object){
    super(props)
    this.state ={
      imageFile: undefined,
    }
  }

  componentDidMount(){
    const {photo} = this.props
    setTimeout(()=>{
      this.setState({
        imageFile: photo,
      })
    },200)
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {className, onClick} = this.props
    const {imageFile} = this.state

    if (!imageFile){
      return null
    }

    const {path:src, type} = imageFile

    return (
      <a onClick={onClick}>
        {type.startsWith('video')?
          <Video
              className={classnames(style.postVideo, className)}
              src={src}
              type={type}
          />
        :
          <img className={classnames(className)} draggable={false} src={src}/>}
      </a>
    )
  }
}
