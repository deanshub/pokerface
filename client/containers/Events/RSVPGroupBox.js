import React, { PropTypes, Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Image, Popup } from 'semantic-ui-react'
import classnames from 'classnames'
import style from './style.css'

@inject('routing')
@inject('auth')
@observer
export default class RSVPGroupBox extends Component {
  static propTypes = {
    group: PropTypes.shape().isRequired,
    groupName: PropTypes.string.isRequired,
    hideWhenEmpty: PropTypes.bool,
  }

  handleAvatarClick(username){
    const { routing, auth} = this.props
    if (username===auth.user.username){
      routing.push('/profile')
    }else{
      routing.push(`/profile/${username}`)
    }
  }

  render(){
    const { group, groupName, hideWhenEmpty } = this.props

    if (hideWhenEmpty && group.length === 0) {
      return null
    }

    return (
      <div className={classnames(style.rsvpGroup)}>
        <div className={classnames(style.rsvpGroupHeader)}>{group.length} {groupName}</div>
        <div className="rsvp-group-content">
          {group.map(({ username, fullname, avatar }) => {
            const imageSrc = `/images/${avatar}`
            const href = `/profile/${username}`
            return (
              <div key={username}>
                <Popup
                    content={fullname}
                    on="hover"
                    trigger={
                  <Image
                      href={href}
                      inline
                      onClick={(e)=>{e.preventDefault(); this.handleAvatarClick(username)}}
                      shape="circular"
                      size="mini"
                      spaced
                      src={imageSrc}
                  />
                  }
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
