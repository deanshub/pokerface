// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Modal, {ModalHeader,ModalContent,ModalFooter}  from '../../components/basic/Modal'
import Button, {ButtonGroup} from '../../components/basic/Button'
import Input from '../../components/basic/Input'
import InputImage from '../../components/basic/InputImage'
import classnames from 'classnames'
import style from './style.css'

@inject('profile')
@inject('auth')
@observer
export default class EditProfile extends Component {
  constructor(props){
    super(props)
    const {auth} = props
    this.state = {
      firstname: auth.user.firstname,
      lastname: auth.user.lastname,
    }

    this.coverSrc = auth.user.coverImage
    this.avatarSrc = auth.user.avatar
  }

  avatarChangeHandler(imageFile){
    this.setState({loadingAvatar:true})
    let reader = new FileReader()

    reader.onload = (e)=>{
      this.avatarSrc = e.target.result
      this.avatar = imageFile
      this.setState({loadingAvatar:false})
    }
    reader.readAsDataURL(imageFile)
  }

  coverImageChangeHandler(imageFile){
    this.setState({loadingCoverImage:true})
    let reader = new FileReader()

    reader.onload = (e)=>{
      this.coverSrc = e.target.result
      this.cover = imageFile
      this.setState({loadingCoverImage:false})
    }
    reader.readAsDataURL(imageFile)
  }

  update(){
    const {toggle, profile, auth} = this.props
    const {firstname, lastname} = this.state
    const personalInfo = {
      cover: this.cover,
      avatar: this.avatar,
      firstname,
      lastname,
    }
    profile.updatePersonalInfo(personalInfo).then((updatedUser)=>{
      auth.updateUserInfo(updatedUser)
      profile.setCurrentUser(updatedUser)
      toggle()
    }).catch((err)=>{
      console.error(err);
      toggle()
    })
  }

  handleChange(e, {name, value}){
    this.setState({
      [name]: value,
    })
  }

  render() {
    const {open, toggle} = this.props
    const {firstname, lastname, loadingCoverImage, loadingAvatar} = this.state

    return (
        <Modal compact open={open}>
          <ModalHeader>
            Account Setting
          </ModalHeader>
          <ModalContent>
            <div>
              <div className={classnames(style.fieldsGroup)}>
                <InputImage
                    avatar
                    label="Profile Picture"
                    loading={loadingAvatar}
                    onSelect={(image) => {
                      this.avatarChangeHandler(image)
                    }}
                    src={this.avatarSrc}
                />
                <div className={classnames(style.name)}>
                  <Input
                      containerStyle={{justifyContent:'baseline'}}
                      label="First name"
                      name="firstname"
                      onChange={::this.handleChange}
                      placeholder="First name"
                      value={firstname}
                  />
                  <div/>
                  <Input
                      label="Last name"
                      name="lastname"
                      onChange={::this.handleChange}
                      placeholder="Last name"
                      value={lastname}
                  />
                </div>
              </div>
              <InputImage
                  label="Cover Photo"
                  loading={loadingCoverImage}
                  onSelect={(image) => {
                    this.coverImageChangeHandler(image)
                  }}
                  src={this.coverSrc}
              />
            </div>
          </ModalContent>
          <ModalFooter>
            <ButtonGroup
                horizontal
                noEqual
                reversed
            >
              <Button onClick={::this.update} primary>Save</Button>
              <Button onClick={toggle}> Cancel </Button>
            </ButtonGroup>
          </ModalFooter>
        </Modal>
    )
  }
}
