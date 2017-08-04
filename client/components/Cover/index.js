// @flow

import React, { Component, PropTypes } from 'react'
import OnlyLoggedinUser from '../OnlyLoggedinUser'
import classnames from 'classnames'
import style from './style.css'
import { Header, Icon } from 'semantic-ui-react'
import EditInfoModal from './EditInfoModal'

export default class Navbar extends Component {
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
    const {title, imageFile} = this.props
    const {editingPersonalInfo} = this.state

    let coverDivStyle = {}
    if (imageFile){
      coverDivStyle.backgroundImage=`url(${imageFile})`
    }

    return (
      <div className={classnames({[style.container]: true, [style.loading]: imageFile===undefined})} style={coverDivStyle}>
        <Header size="huge" style={{color:'white',zIndex:2, textShadow:'1px 1px #525252'}}>{title}</Header>
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
        <EditInfoModal
            open={editingPersonalInfo}
            toggle={::this.toggleEditPersonalInfo}
        />
      </div>
    )
  }
}
