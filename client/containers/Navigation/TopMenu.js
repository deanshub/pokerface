// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import DropDown from '../../components/basic/DropDown'

import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('routing')
@observer
export default class TopMenu extends Component {
  constructor(props){
    super(props)
    this.state = {showTopMenu:false, selectUserModalOpen:false}
  }

  handleLogout(){
    const {routing, auth} = this.props
    localStorage.removeItem('jwt')
    auth.logout()
    routing.replace('/login')
  }

  render(){
    const {auth} = this.props
    const showSwitchUser = auth.optionalUsers.length > 0

    const {user} = auth
    const {selectUserModalOpen} = this.state
    const trigger = <div
        className={classnames(style.config)}
        onBlur={() => {this.setState({showTopMenu:false})}}
        onClick={() => {this.setState({showTopMenu:true})}}
    />

    return (
      <div>
        <DropDown trigger={trigger}>
          <div className={classnames(style.topMenu)}>
           <div className={classnames(style.signedInAsCard)}>
             <img src={user.avatar}/>
             <div>
               <div className={classnames(style.name)}>{user.fullname}</div>
               <div className={classnames(style.email)}>{user.email}</div>
             </div>
           </div>
           {
             showSwitchUser &&
             <div
                 className={classnames(style.topMenuItem)}
                 onClick={() => this.setState({selectUserModalOpen:true,showTopMenu:false})}
             >
               Switch user
             </div>
           }

           <div className={classnames(style.topMenuItem)} onClick={::this.handleLogout}>Logout</div>
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
     </div>
    )
  }
}
