// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import classnames from 'classnames'
import style from './style.css'
import Button from '../basic/Button'
import Modal, {ModalHeader, ModalContent} from '../basic/Modal'
import Image from '../basic/Image'
import dateIcon from '../../assets/profile/date-gray.png'
import mapIcon from '../../assets/profile/map.png'
import userIcon from '../../assets/profile/user-search.png'
import qrLogo from '../../assets/qr-logo.png'

export default class Cover extends Component {
  static propTypes = {
    imageFile: PropTypes.string,
    title: PropTypes.string,
  }

  constructor(props){
    super(props)
    this.state= {
      editingPersonalInfo: false,
      qrOpen: false,
    }
  }

  getDetailsElement(){
    const {details} = this.props
    const {qrOpen} = this.state

    const parsedLocation = (details.location||'').replace(/^\s+/,'').replace(/\s+$/,'').replace(/\s+/g,' ').replace(/\s*,\s*/g,',').replace(/\s/g,'+')

    return (
      <div className={classnames(style.detailsContainer)}>
        <div className={classnames(style.detailsLeftPane)}>
          <div className={classnames(style.detailsText, style.noTopMargin)}>
            {details.subtype?`${details.subtype} - `:''}{details.type}
          </div>
          <div className={classnames(style.detailsText)}>
            {details.description}
          </div>
          <div className={classnames(style.divider)}/>
          {
            details.startDate.toString()&&
            <div className={classnames(style.detailsText)}>
              <img className={classnames(style.icon)} src={dateIcon}/> {details.startDate.format('D/M/YYYY H:mm')}&nbsp;{`(${details.startDate.fromNow()})`}
            </div>
          }
          {
            details.location&&
            <div className={classnames(style.detailsText)}>
              <img className={classnames(style.icon)} src={mapIcon}/> {details.location} &nbsp;&nbsp; <a href={`https://www.google.com/maps/search/${parsedLocation}`} target="_blank">See Map</a>
            </div>
          }
          {
            details.going>0&&
            <div className={classnames(style.detailsText)}>
              <img className={classnames(style.icon)} src={userIcon}/> {details.going}&nbsp; People Going
            </div>
          }
        </div>
        <div className={classnames(style.detailsRightPane)}>
          <img
              className={classnames(style.imgIcon)}
              onClick={()=>this.setState({qrOpen:true})}
              src={qrLogo}
          />
        </div>
        <Modal
            closeOnBlur
            onClose={()=>this.setState({qrOpen:false})}
            open={qrOpen}
        >
          <ModalHeader>
            {details.fullname} - QR code
          </ModalHeader>
          <ModalContent>
            <div className={classnames(style.qrContainer)}>
              <QRCode
                  size={526}
                  value={`${window.location.protocol}//${window.location.host}/events/${details.id}`}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>
    )
  }

  render() {
    const {details} = this.props

    let coverDivStyle = {}
    if (details.coverImage){
      coverDivStyle.backgroundImage=`url(${details.coverImage})`
    }

    return (
      <div className={classnames(style.coverContainer)}>
        <div className={classnames(style.imageContainer)} style={coverDivStyle}>
          <div className={classnames(style.name,{[style.coverImageNotExist]: !details.coverImage})}>{details.fullname}</div>
          {
            details.avatar&&
            <Image
                avatar
                big
                className={classnames(style.avatar)}
                src={details.avatar}
            />
          }
        </div>
        {
          details.startDate&&
          this.getDetailsElement()
        }
      </div>
    )
  }
}
