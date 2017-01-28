import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import {Icon} from 'react-fa'

export default class Navbar extends Component {
  static propTypes = {
    // avatar: PropTypes.string,
  }

  constructor(props){
    super(props)
    this.state = {
    //   avatarImage: undefined,
    }
  }

  componentDidMount(){
    // const {avatar} = this.props
    //
    // System.import(`../../assets/images/${avatar}`).then(avatarImage=>{
    //   this.setState({
    //     avatarImage,
    //   })
    // })
  }

  render() {
    // const {avatarImage} = this.state

    return (
      <div className={classnames(style.container)}>
        <div className={classnames(style.widget)}>
          <div>
            Chart
          </div>
        </div>
        <div className={classnames(style.widget)}>
          <div>
            Winings
          </div>
          <div>
            2,000$
          </div>
        </div>
        <div className={classnames(style.widget)}>
          <div>
            Something Else
          </div>
        </div>
      </div>
    )
  }
}
