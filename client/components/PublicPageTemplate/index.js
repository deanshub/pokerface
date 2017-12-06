// @flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Dimmer, Grid, Loader } from 'semantic-ui-react'
import Footer from '../../containers/PublicPageFooter'
import Logo from '../Logo'

export default class PublicPageTemplate extends Component {

  render() {
    const { children, horizontal, loading } = this.props

    return (
      <Grid divided="vertically">
        <Dimmer active={loading} inverted>
          <Loader content="Loading" inverted/>
        </Dimmer>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Logo/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered columns="equal">
            {
              (Array.isArray(children) && horizontal)?
                children.map((child, index) => <Grid.Column key={index}>{child}</Grid.Column>)
              :
                <Grid.Column>{children}</Grid.Column>
            }
        </Grid.Row>
        <Footer/>
      </Grid>
    )
  }
}
