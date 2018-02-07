// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import DropDown from '../../components/basic/DropDown'
import SelectUserModal from '../SelectUserModal'
import EditInfoModal from '../../components/Cover/EditInfoModal'
import Image from '../../components/basic/Image'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('routing')
@observer
export default class TopMenu extends Component {
  constructor(props){
    super(props)
    this.state = {editingPersonalInfo:false, selectUserModalOpen:false}
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

  render(){
    const {auth} = this.props
    const showSwitchUser = auth.optionalUsers.length > 0

    const {user} = auth
    const {editingPersonalInfo, selectUserModalOpen} = this.state
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
      <div>
        <DropDown oneClick trigger={trigger}>
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

           <div
               className={classnames(style.topMenuItem, style.topMenuClickableItem)}
               onClick={::this.handleLogout}
           >
             Logout
           </div>
         </div>
        </DropDown>
       {
         selectUserModalOpen &&
         <SelectUserModal
             onClose={() => this.setState({selectUserModalOpen:false})}
             open={selectUserModalOpen}
             redirectUrl="/"
         />
       }
       <EditInfoModal
           open={editingPersonalInfo}
           toggle={::this.toggleEditPersonalInfo}
       />
     </div>
    )
  }
}
