// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import DevTools from 'mobx-react-devtools'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loader from '../../components/basic/Loader'
import Feed from '../Feed'
import RebrandedBlindsTimer from '../RebrandedBlindsTimer'
import Navbar from '../../components/Navbar'
import MobileNavbar from '../../components/Navbar/Mobile'
import TopMenu from './TopMenu'
import MobileSearchBar from './MobileSearchBar'
import IsMobile from '../../components/IsMobile'
import ResponsiveContainer from '../../components/ResponsiveContainer'
import classnames from 'classnames'
import style from './style.css'
import image from '../../assets/landing logo.png'
import logo from '../../assets/mobile/logo-mobile.png'

const LoadableLearn = Loadable({
  loader: () => import('../../components/Learn'),
  loading: Loader,
})
const LoadableNoMatch = Loadable({
  loader: () => import('../../components/NoMatch'),
  loading: Loader,
})
const LoadableSpotNote = Loadable({
  loader: () => import('../../components/SpotNote'),
  loading: Loader,
})
const LoadableProfile = Loadable({
  loader: () => import('../../components/Profile'),
  loading: Loader,
})
const LoadableSingleEvent = Loadable({
  loader: () => import('../Event'),
  loading: Loader,
})
const LoadableEvents = Loadable({
  loader: () => import('../Events'),
  loading: Loader,
})


export default class Navigation extends Component {
  static propTypes={
    children: PropTypes.element,
  }

  constructor(props){
    super(props)
    this.state = {navbarOpen:false, searchBarOpen:false}
  }

  onCloseMobileNavbar(){
    this.setState({navbarOpen:false})
  }

  openMobileNavbar(){
    this.setState({navbarOpen:true})
  }

  onCloseMobileSearchBar(){
    this.setState({searchBarOpen:false})
  }

  openMobileSearchBar(){
    this.setState({searchBarOpen:true})
  }

  getHeader(isMobile){
    return isMobile?
      <div className={classnames(style.header)}>
        <div className={classnames(style.menu)} onClick={::this.openMobileNavbar}/>
        <img className={classnames(style.logo)} src={logo}/>
        <div className={classnames(style.search)} onClick={::this.openMobileSearchBar}/>
      </div>
    :
    <div className={classnames(style.header)}>
      <div className={classnames(style.title)}>
        <img className={classnames(style.titleImg)} src={image}/>
        <div>
          Pokerface.io
        </div>
      </div>
      <TopMenu/>
    </div>
  }

  render() {
    const {navbarOpen, searchBarOpen} = this.state

    return (
      <DocumentTitle title="Pokerface.io">
        <div>
          {
            process.env.NODE_ENV==='development'?<DevTools/>:null
          }

          <IsMobile render={::this.getHeader}/>
          <ResponsiveContainer
              desktopClassName={classnames(style.container)}
              mobileClassName={classnames(style.mobileContainer)}
          >
            <IsMobile
                render={(isMobile) => {
                  return !isMobile?
                    <div className={classnames(style.navbar)}>
                      <Navbar/>
                    </div>
                  :
                    null
                }}
            />
            <div className={classnames(style.content)}>
              <Switch>
                <Route
                    component={Feed}
                    exact
                    path="/"
                />
                <Route
                    component={LoadableProfile}
                    exact
                    path="/profile/:username"
                />
                <Route
                    component={LoadableSingleEvent}
                    exact
                    path="/events/:eventId"
                />
                <Route
                    component={LoadableEvents}
                    exact
                    path="/events"
                />
                <Route
                    component={RebrandedBlindsTimer}
                    exact
                    path="/timer"
                />
                <Route
                    component={LoadableLearn}
                    exact
                    path="/smart"
                />
                <Route
                    component={LoadableSpotNote}
                    exact
                    path="/spotnote"
                />
                <Route component={LoadableNoMatch}/>
              </Switch>
            </div>
          </ResponsiveContainer>
          <IsMobile
              render={(isMobile) => {
                return (
                  isMobile?
                  [
                    <MobileNavbar onClose={::this.onCloseMobileNavbar} open={navbarOpen}/>,
                    <MobileSearchBar onClose={::this.onCloseMobileSearchBar} open={searchBarOpen}/>,
                  ]
                  :
                    null
                )
              }}
          />

        </div>
      </DocumentTitle>
    )
  }
}
