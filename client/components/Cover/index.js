// @flow

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import style from './style.css'
import { Header } from 'semantic-ui-react'

export default class Navbar extends Component {
  static propTypes = {
    imageFile: PropTypes.string,
    title: PropTypes.string,
  }

  render() {
    const {title, imageFile} = this.props
    let coverDivStyle = {}
    if (imageFile){
      coverDivStyle.backgroundImage=`url(${imageFile})`
    }

    return (
      <div className={classnames({[style.container]: true, [style.loading]: imageFile===undefined})} style={coverDivStyle}>
        <Header size="huge" style={{color:'white',zIndex:2, textShadow:'1px 1px #525252'}}>{title}</Header>
      </div>
    )
  }
}
