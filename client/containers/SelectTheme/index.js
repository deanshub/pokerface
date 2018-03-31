// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Checkbox from '../../components/basic/Checkbox'
import Tooltip from '../../components/basic/Tooltip'
import IsMobile from '../../components/IsMobile'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@observer
export default class SelectTheme extends Component {

  onChangeTheme(e, {checked}){
    this.setTheme(checked?'Night':'Day')
  }

  setTheme(theme){
    const {auth} = this.props
    auth.setTheme(theme)
  }

  render(){
    const {auth, className} = this.props
    const ResponsiveSelect = ({theme}) => (
      <IsMobile
          render={(isMobile) => {
            return (
              isMobile?
                <Tooltip
                    oneClick
                    trigger={
                      <div className={classnames(className, style.themeSetting)}>
                        Theme
                      </div>
                    }
                >
                  <div
                      className={classnames(style.theme, {[style.active]:theme==='day'})}
                      onClick={()=>{this.setTheme('Day')}}
                  >
                    Day
                  </div>
                  <div
                      className={classnames(style.theme, {[style.active]:theme==='night'})}
                      onClick={()=>{this.setTheme('Night')}}
                  >
                    Night
                  </div>
                </Tooltip>
              :
                <div className={classnames(className, style.themeSetting)} onClick={(e) => e.stopPropagation()}>
                  <div
                      className={classnames(style.theme, {[style.active]:theme==='day'})}
                      onClick={()=>{this.setTheme('Day')}}
                  >
                    Day
                  </div>
                  <Checkbox
                      centered
                      defaultChecked={theme!=='day'}
                      id="themeToggle"
                      onChange={::this.onChangeTheme}
                      style={{'flex':0}}
                      toggleStyle
                  />
                  <div
                      className={classnames(style.theme, {[style.active]:theme==='night'})}
                      onClick={()=>{this.setTheme('Night')}}
                  >
                    Night
                  </div>
                </div>
            )
        }}
      />
    )

    return <ResponsiveSelect theme={auth.theme}/>
  }
}
