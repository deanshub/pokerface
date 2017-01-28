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
      imageFile:'',
    }
  }

  componentDidMount(){
    const {image} = this.props

    System.import(`../../assets/images/${image}`).then(imageFile=>{
      this.setState({
        imageFile,
      })
    })
  }

  render() {
    const {title} = this.props
    const {imageFile} = this.state
    let coverDivStyle = {}
    if (imageFile){
      coverDivStyle.backgroundImage=`url(${imageFile})`
    }

    return (
      <div className={classnames(style.container)} style={coverDivStyle}>
        <div className={classnames(style.title)} >{title}</div>
      </div>
    )
  }
}
