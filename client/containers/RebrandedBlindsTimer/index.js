import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import BlindsTimer from '../../components/BlindsTimer'

@inject('auth')
@observer
export default class RebrandedBlindsTimer extends Component {

  render(){
    const {user} = this.props.auth

    let image
    let title

    if (user.rebranding){
      image = user.avatar
      title = user.fullname
    }
    return <BlindsTimer image={image} title={title}/>
  }

}
