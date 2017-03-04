// @flow

import React, { Component, PropTypes } from 'react'
// import classnames from 'classnames'
// import style from './style.css'
import { Grid, Header} from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

const footerStyle = {
  position:'absolute',
  bottom: 0,
  margin: '0 10px',
}

@inject('auth')
@observer
export default class Footer extends Component {
  render() {
    const {auth} = this.props

    return (
      <Grid.Row stretched style={footerStyle}>
        <Grid.Column width={3}>
          <Header
              color="red"
              size="tiny"
          >
            Ⓒ Pokerface.io
          </Header>
        </Grid.Column>
        <Grid.Column textAlign="center" width={8}>
          <Header size="tiny">
            We support Open Source! <a href="#" onClick={()=>{auth.opensourceModalOpen=true}}>Here</a>'s a List of opensource software that we use
          </Header>
        </Grid.Column>
        <Grid.Column textAlign="right" width={5}>
          <Header size="tiny">
            Any issues or suggestion can be sent to <a href="mailto:support@pokerface.io?subject=Pokerface I have a suggestion&body=Hi Pokerface, I enjoy you very much, ">Support@pokerface.io</a>
          </Header>
        </Grid.Column>
      </Grid.Row>
    )
  }
}
