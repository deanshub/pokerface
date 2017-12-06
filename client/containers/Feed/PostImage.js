// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

export default class PostImage extends Component {
  state: {
    imageFile: ?String
  }

  static propTypes = {
    onClick: PropTypes.func,
    photo: PropTypes.string,
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
    const {onClick, className} = this.props
    const {imageFile} = this.state

    return (
      <a onClick={onClick}>
        <img
            className={className}
            draggable={false}
            src={imageFile}
        />
      </a>
    )
  }
}
