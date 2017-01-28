import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Navbar extends Component {
  static propTypes = {
    avatar: PropTypes.string,
  }

  constructor(props){
    super(props)
    this.state = {
      avatarImage: undefined,
    }
  }

  componentDidMount(){
    const {avatar} = this.props

    System.import(`../../assets/images/${avatar}`).then(avatarImage=>{
      this.setState({
        avatarImage,
      })
    })
  }

  render() {
    const {avatarImage} = this.state
    let avatarDivStyle = {}
    if (avatarImage){
      avatarDivStyle.backgroundImage = `url(${avatarImage})`
    }

    return (
      <div className={classnames(style.container)}>
        <div className={classnames(style.navItem)} >Game</div>
        <div className={classnames(style.navItem)} >Lorem</div>
        <div className={classnames(style.navItem, style.avatar)} style={avatarDivStyle} />
        <div className={classnames(style.navItem)} >Ipsum</div>
        <div className={classnames(style.navItem)} >Play</div>
      </div>
    )
  }
}
