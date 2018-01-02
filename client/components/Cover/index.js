// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OnlyLoggedinUser from '../OnlyLoggedinUser'
import classnames from 'classnames'
import style from './style.css'
import { Icon } from 'semantic-ui-react'
import EditInfoModal from './EditInfoModal'
import Image from '../basic/Image'

export default class Cover extends Component {
  static propTypes = {
    imageFile: PropTypes.string,
    title: PropTypes.string,
  }

  constructor(props){
    super(props)
    this.state= {
      editingPersonalInfo: false,
    }
  }

  toggleEditPersonalInfo(){
    this.setState({
      editingPersonalInfo: !this.state.editingPersonalInfo,
    })
  }

  render() {
    const {user} = this.props
    const {editingPersonalInfo} = this.state

    let coverDivStyle = {}
    if (user.coverImage){
      coverDivStyle.backgroundImage=`url(${user.coverImage})`
    }

    return (
      <div className={classnames({[style.container]: true})} style={coverDivStyle}>
        <div className={classnames(style.name,{[style.coverImageNotExist]: user.coverImage===undefined})}>{user.fullname}</div>
        <OnlyLoggedinUser>
          <Icon
              circular
              className={classnames(style.edit)}
              color="black"
              inverted
              name="edit"
              onClick={::this.toggleEditPersonalInfo}
              size="large"
          />
        </OnlyLoggedinUser>

        <Image
            avatar
            big
            className={classnames(style.avatar)}
            src={user.avatar}
        />
        <EditInfoModal
            open={editingPersonalInfo}
            toggle={::this.toggleEditPersonalInfo}
        />
      </div>
    )
  }
}
