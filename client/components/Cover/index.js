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

    import(`../../assets/images/${image}`).then(imageFile=>{
      this.setState({
        imageFile,
        loading: false,
      })
    })
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
