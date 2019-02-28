// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import DevTools from 'mobx-react-devtools'
import { observer, inject } from 'mobx-react'
import { Route, Switch, NavLink, Link } from 'react-router-dom'
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

const LoadablePreFlop = Loadable({
  loader: () => import('../../components/PreFlop'),
  loading: Loader,
})
const LoadableShoveFold = Loadable({
  loader: () => import('../../components/ShoveFold'),
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
const LoadableCashCalc = Loadable({
  loader: () => import(/* webpackPrefetch: true */ '../CashCalculator'),
  loading: Loader,
})

@inject('routing')
@observer
class Navigation extends Component {
  static propTypes={
    children: PropTypes.element,
    theme: PropTypes.string,
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
    const {theme} = this.props

    return isMobile?
      <div className={classnames(style.header, style[theme])}>
        <div className={classnames(style.menu)} onClick={::this.openMobileNavbar}/>
        <Link to="/"><img className={classnames(style.logo)} src={logo}/></Link>
        <div className={classnames(style.search)} onClick={::this.openMobileSearchBar}/>
      </div>
      :
      <div className={classnames(style.header, style[theme])}>
        <NavLink
            className={classnames(style.title)}
            exact
            to="/"
        >
          <img className={classnames(style.titleImg)} src={image}/>
          <div>
            Pokerface.io
          </div>
        </NavLink>
        <TopMenu/>
      </div>
  }

  render() {
    const {theme} = this.props
    const {navbarOpen, searchBarOpen} = this.state

    return (
      <DocumentTitle title="Pokerface.io">
        <React.Fragment>
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
                    path="/tools/timer"
                />
                <Route
                    exact
                    path="/tools/pre-flop"
                    render={props => (
                      <LoadablePreFlop {...props} theme={theme}/>
                    )}
                />
                <Route
                    exact
                    path="/tools/shove-fold"
                    render={props => (
                      <LoadableShoveFold {...props} theme={theme}/>
                    )}
                />
                <Route
                    component={LoadableSpotNote}
                    exact
                    path="/tools/spotnote"
                />
                <Route
                    component={LoadableCashCalc}
                    exact
                    path="/tools/cash-calc"
                />
                <Route component={LoadableNoMatch}/>
              </Switch>
            </div>
          </ResponsiveContainer>
          <IsMobile
              render={(isMobile) => {
                return (
                  isMobile?
                    <React.Fragment>
                      <MobileNavbar
                          key="navbar"
                          onClose={::this.onCloseMobileNavbar}
                          open={navbarOpen}
                      />
                      <MobileSearchBar
                          key="searchBar"
                          onClose={::this.onCloseMobileSearchBar}
                          open={searchBarOpen}
                      />
                    </React.Fragment>
                    :
                      null
                )
              }}
          />

        </React.Fragment>
      </DocumentTitle>
    )
  }
}

export default Navigation
