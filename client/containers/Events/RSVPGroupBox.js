import React, { Component, PropTypes } from 'react'
import { Image, Popup } from 'semantic-ui-react'
import classnames from 'classnames'
import style from './style.css'
import { observer, inject } from 'mobx-react'


@inject('routing')
@observer
export default class RSVPGroupBox extends Component {
  static propTypes = {
    group: PropTypes.shape().isRequired,
    groupName: PropTypes.string.isRequired,
    hideWhenEmpty: PropTypes.bool,
    routing: PropTypes.shape(),
  }

  handleAvatarClick(e,href){
    const { routing } = this.props

    e.preventDefault()
    routing.push(href)
  }

  render(){
    const { group, groupName, hideWhenEmpty } = this.props

    if (hideWhenEmpty && group.length === 0) {
      return null
    }

    return (
      <div className={classnames(style.rsvpGroup)}>
        <div className={classnames(style.rsvpGroupHeader)}>{group.length} {groupName}</div>
        <div>
          {group.map(({ username, fullname, avatar }) => {
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
                          onClick={(e)=>{this.handleAvatarClick(e, href)}}
                          shape="circular"
                          size="mini"
                          spaced
                          src={avatar}
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
