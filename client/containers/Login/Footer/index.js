import React, { Component, PropTypes } from 'react'
// import classnames from 'classnames'
// import style from './style.css'
import { Grid, Header} from 'semantic-ui-react'

const footerStyle = {
  position:'absolute',
  bottom: 0,
  margin: '0 10px',
}

export default class Navigation extends Component {
  render() {
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
        <Grid.Column textAlign="right" width={13}>
          <Header size="tiny">
            Any issues or suggestion can be sent to <a href="mailto:support@pokerface.io?subject=Pokerface I have a suggestion&body=Hi Pokerface, I enjoy you very much, ">Support@pokerface.io</a>
          </Header>
        </Grid.Column>
      </Grid.Row>
    )
  }
}
