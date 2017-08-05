import React, { PropTypes } from 'react'
import { Image, Popup } from 'semantic-ui-react'
import classnames from 'classnames'
import style from './style.css'

const RSVPGroupBox =({ group, groupName, hideWhenEmpty }) => {
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

RSVPGroupBox.propTypes = {
  group: PropTypes.shape().isRequired,
  groupName: PropTypes.string.isRequired,
  hideWhenEmpty: PropTypes.bool,
}

export default RSVPGroupBox
