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
    return (
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
                      className={classnames(style.theme, {[style.active]:auth.theme==='day'})}
                      onClick={()=>{this.setTheme('Day')}}
                  >
                    Day
                  </div>
                  <div
                      className={classnames(style.theme, {[style.active]:auth.theme==='night'})}
                      onClick={()=>{this.setTheme('Night')}}
                  >
                    Night
                  </div>
                </Tooltip>
              :
                <div className={classnames(className, style.themeSetting)} onClick={(e) => e.stopPropagation()}>
                  <div
                      className={classnames(style.theme, {[style.active]:auth.theme==='day'})}
                      onClick={()=>{this.setTheme('Day')}}
                  >
                    Day
                  </div>
                  <Checkbox
                      centered
                      defaultChecked={auth.theme!=='day'}
                      id="themeToggle"
                      onChange={::this.onChangeTheme}
                      style={{'flex':0}}
                      toggleStyle
                  />
                  <div
                      className={classnames(style.theme, {[style.active]:auth.theme==='night'})}
                      onClick={()=>{this.setTheme('Night')}}
                  >
                    Night
                  </div>
                </div>
            )
        }}
      />

    )
  }
}
