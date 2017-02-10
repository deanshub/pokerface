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

    // <Image
    //     className={classnames(style.coverImage)}
    //     fluid
    //     src={imageFile}
    // />
    return (
      <div className={classnames(style.container)} style={coverDivStyle}>
        <Header size="huge" style={{color:'white'}}>{title}</Header>
      </div>
    )
  }
}
