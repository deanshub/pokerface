import React, { Component } from 'react'
import {Header, Image } from 'semantic-ui-react'

export default () => (
  <Header
      size="huge"
      textAlign="center"
  >
    <Image src="/images/logo.png"/>
    <Header.Content>
      <Header content="Pokerface.io" subheader="Social platform for Poker players"/>
  </Header.Content>
  </Header>
)
