import React, { Component, PropTypes } from 'react'
import { Image } from 'semantic-ui-react'

export default class Events extends Component {
  static propTypes = {
    location: PropTypes.string,
  }
  render() {
    let {location} = this.props
    location = location||''
    const parsedLocation = location.replace(/^\s+/,'').replace(/\s+$/,'').replace(/\s+/g,' ').replace(/\s*,\s*/g,',').replace(/\s/g,'+')
    const url = `http://maps.googleapis.com/maps/api/staticmap?center=${parsedLocation}&zoom=15&size=400x400&scale=2&markers=color:red|${parsedLocation}&key=AIzaSyBQbB9G6I5J0OaMLAcB_p0s81RBykQLgjI`

    return (
      <a href={`https://www.google.com/maps/search/${parsedLocation}`} target="_blank">
        <Image
            alt={location}
            fluid
            src={url}
        />
      </a>
    )
  }
}
