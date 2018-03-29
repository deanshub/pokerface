// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Tooltip from '../../components/basic/Tooltip'
import SelectUserModal from '../SelectUserModal'
import EditProfileModal from '../EditProfile'
import Image from '../../components/basic/Image'
import Checkbox from '../../components/basic/Checkbox'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('routing')
@observer
export default class TopMenu extends Component {
  constructor(props){
    super(props)

    // const {theme} = this.props.auth
    this.state = {
      // theme,
      editingPersonalInfo:false,
      selectUserModalOpen:false
    }
  }

  handleLogout(){
    const {routing, auth} = this.props
    localStorage.removeItem('jwt')
    auth.logout()
    routing.replace('/login')
  }

  moveToProfile(){
    const {auth, routing} = this.props
    const {username} = auth.user

    routing.push(`/profile/${username}`)
  }

  toggleEditPersonalInfo(){
    this.setState({
      editingPersonalInfo: !this.state.editingPersonalInfo,
    })
  }

  onChangeTheme(e, {checked}){
    this.setTheme(checked?'Night':'Day')
  }

  setTheme(theme){
    const {auth} = this.props
    auth.setTheme(theme)
    // this.setState({theme})
  }

  render(){
    const {auth} = this.props
    const showSwitchUser = auth.optionalUsers.length > 0

    const {user} = auth
    const {editingPersonalInfo, selectUserModalOpen, theme} = this.state
    const trigger = (
      <div className={classnames(style.triggerContainer)}>
        <Image
            avatar
            className={classnames(style.avatar)}
            small
            src={user.avatar}
        />
        <div className={classnames(style.configPointer)}/>
      </div>
    )

    return (
      <React.Fragment>
        <Tooltip
            className={style.tooltipClassName}
            oneClick
            trigger={trigger}
        >
          <div className={classnames(style.topMenu)}>
            <div
                className={classnames(style.topMenuItem, style.signedInAsCard)}
                onClick={::this.moveToProfile}
            >
              <img src={user.avatar}/>
              <div>
                <div className={classnames(style.name)}>{user.fullname}</div>
                <div className={classnames(style.email)}>{user.email}</div>
              </div>
            </div>
            <div className={classnames(style.divider)}/>
            <div
                className={classnames(style.topMenuItem, style.topMenuClickableItem)}
                onClick={::this.toggleEditPersonalInfo}
            >
              Edit
            </div>
            {
              showSwitchUser &&
              <div
                  className={classnames(style.topMenuItem, style.topMenuClickableItem)}
                  onClick={() => this.setState({selectUserModalOpen:true})}
              >
                Switch user
              </div>
            }
            <div className={classnames(style.topMenuItem, style.themeSetting)} onClick={(e) => e.stopPropagation()}>
              <div
                  className={classnames({[style.active]:auth.theme==='day'})}
                  onClick={()=>{this.setTheme('Day')}}
              >
                Day
              </div>
              <Checkbox
                  defaultChecked={auth.theme!=='day'}
                  id="themeToggle"
                  onChange={::this.onChangeTheme}
                  style={{'flex':0}}
                  toggleStyle
              />
              <div
                  className={classnames({[style.active]:auth.theme==='night'})}
                  onClick={()=>{this.setTheme('Night')}}
              >
                Night
              </div>
            </div>
            <div
                className={classnames(style.topMenuItem, style.topMenuClickableItem)}
                onClick={::this.handleLogout}
            >
              Logout
            </div>
          </div>
        </Tooltip>
        {
          selectUserModalOpen &&
          <SelectUserModal
              onClose={() => this.setState({selectUserModalOpen:false})}
              open={selectUserModalOpen}
              redirectUrl="/"
          />
        }
        <EditProfileModal
            open={editingPersonalInfo}
            toggle={::this.toggleEditPersonalInfo}
        />
      </React.Fragment>
    )
  }
}
