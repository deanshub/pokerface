// @flow

import React, { Component, PropTypes } from 'react'
import { Dimmer, Grid, Header, Loader, Image } from 'semantic-ui-react'
import Footer from '../../containers/PublicPageFooter'

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

            <Header
                size="huge"
                textAlign="center"
            >
              <Image src="/images/logo.png"/>
              <Header.Content>
                <Header content="Pokerface.io" subheader="Social platform for Poker players"/>
            </Header.Content>
            </Header>
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
