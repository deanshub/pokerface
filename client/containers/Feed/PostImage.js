// @flow
import React, { Component, PropTypes } from 'react'
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
    // import(`../../assets/images/${photo}`).then(imageFile=>{
    //   this.setState({
    //     imageFile,
    //   },()=>{
    //     setTimeout(()=>{
    //       this.setState({
    //         loading: false,
    //       })
    //     },500)
    //   })
    // })
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {onClick} = this.props
    const {imageFile} = this.state

    return (
      <a onClick={onClick}>
        <img draggable={false} src={imageFile} />
      </a>
    )
  }
}
