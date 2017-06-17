// @flow

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import { Header } from 'semantic-ui-react'

export default class Navbar extends Component {
  static propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
  }

  constructor(props){
    super(props)
    this.state = {
      imageFile:'',
      loading: true,
    }
  }

  componentDidMount(){
    const {image} = this.props

    if (image.startsWith('http')){
      this.setState({
        imageFile:image,
      },()=>{
        setTimeout(()=>{
          this.setState({
            loading: false,
          })
        },100)
      })
    }else{
      import(`../../assets/images/${image}`).then(imageFile=>{
        this.setState({
          imageFile,
        },()=>{
          setTimeout(()=>{
            this.setState({
              loading: false,
            })
          },100)
        })
      })
    }
  }

  render() {
    const {title} = this.props
    const {imageFile, loading} = this.state
    let coverDivStyle = {}
    if (imageFile){
      coverDivStyle.backgroundImage=`url(${imageFile})`
    }

    return (
      <div className={classnames({[style.container]: true, [style.loading]: loading})} style={coverDivStyle}>
        <Header size="huge" style={{color:'white',zIndex:2}}>{title}</Header>
      </div>
    )
  }
}
