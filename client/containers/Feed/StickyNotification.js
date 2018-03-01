import React, { Component } from 'react'
import { Sticky } from 'react-sticky'
import Notification from '../../components/Notification'
import IsMobile from '../../components/IsMobile'
import { paddingTop, paddingTopMobile } from '../../constants/styles.css'
import classnames from 'classnames'
import style from './style.css'

export default class StickyNotification extends Component {

  componentDidMount(){
    //window.dispatchEvent(new Event('scroll'))
  }

  render(){
    const {onClick, postsCount} = this.props

    return (
      <Sticky topOffset={-80}>
      {
        ({style:localStyle}) => {
          return (
            <IsMobile
                render={(isMobile) => {
                  const top = isMobile?paddingTopMobile:paddingTop

                  return (
                    <header
                        className={classnames(style.sticky)}
                        style={{...localStyle, top}}
                    >
                      <Notification
                          className={classnames(style.notification)}
                          label="New Posts"
                          number={postsCount}
                          onClick={onClick}
                      />
                    </header>
                  )
                }}
            />
          )
        }
      }
      </Sticky>
    )
  }
}
