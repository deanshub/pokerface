import React, { Component, PropTypes } from 'react'
import { Image } from 'semantic-ui-react'
import classnames from 'classnames'
import style from './style.css'

export default class Events extends Component {
  render() {
    const {location} = this.props
    const parsedLocation = location.replace(/^\s+/,'').replace(/\s+$/,'').replace(/\s+/g,' ').replace(/\s*,\s*/g,',').replace(/\s/g,'+')
    const url = `http://maps.googleapis.com/maps/api/staticmap?center=${parsedLocation}&zoom=15&size=400x400&scale=2&markers=color:red|${parsedLocation}&key=AIzaSyBQbB9G6I5J0OaMLAcB_p0s81RBykQLgjI`

    return (
      <a href={`https://www.google.com/maps/search/${parsedLocation}`} target="_blank">
        <Image
            alt={location}
            className={classnames(style.mapImage)}
            fluid
            height={400}
            src={url}
            width={400}
        />
      </a>
    )
  }
}
