//@flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Modal, List } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('auth')
@observer
export default class OpensourceModal extends Component {
  render() {
    const {auth} = this.props

    return (
      <Modal
          dimmer="inverted"
          onClose={()=>{auth.opensourceModalOpen=false}}
          open={auth.opensourceModalOpen}
      >
        <Modal.Header>Opensource Software used in Pokerface.io</Modal.Header>
        <Modal.Content>
        {/* <Modal.Content image> */}
          {/* <Image
              size="medium"
              src="http://semantic-ui.com/images/avatar2/large/rachel.png"
              wrapped
          /> */}
          <Modal.Description>
            {/* <Header>Default Profile Image</Header> */}
            <List bulleted>
              <List.Item href="https://nodejs.org/en/" target="_blank" >nodeJs</List.Item>
              <List.Item href="https://www.postgresql.org/" target="_blank" >Postgres</List.Item>
              <List.Item href="https://babeljs.io/" target="_blank" >Babel</List.Item>
              <List.Item href="https://facebook.github.io/react/" target="_blank" >React</List.Item>
              <List.Item href="https://github.com/JedWatson/classnames" target="_blank" >classnames</List.Item>
              <List.Item href="https://webpack.github.io/" target="_blank" >webpack</List.Item>
              <List.Item href="https://flowtype.org/" target="_blank" >flowtype</List.Item>
              <List.Item href="https://mobx.js.org/" target="_blank" >mobx</List.Item>
              <List.Item href="http://postcss.org/" target="_blank" >postcss</List.Item>
              <List.Item href="https://jonathantneal.github.io/precss/" target="_blank" >precss</List.Item>
              <List.Item href="http://gaearon.github.io/react-hot-loader/" target="_blank" >React Hot Loader</List.Item>
              <List.Item href="https://reacttraining.com/react-router/" target="_blank" >React Router</List.Item>
              <List.Item href="https://momentjs.com/" target="_blank" >Moment</List.Item>
              <List.Item href="http://ramdajs.com/" target="_blank" >Ramda</List.Item>
              <List.Item href="https://github.com/YouCanBookMe/react-datetime" target="_blank" >React Datetime</List.Item>
              <List.Item href="http://recharts.org/" target="_blank" >Recharts</List.Item>
              <List.Item href="http://react.semantic-ui.com/introduction" target="_blank" >react.semantic-ui</List.Item>
              <List.Item href="http://selfthinker.github.io/CSS-Playing-Cards/" target="_blank" >css playing cards</List.Item>
              <List.Item href="http://visionmedia.github.io/superagent/" target="_blank" >SuperAgent</List.Item>
              <List.Item href="http://graphql.org/" target="_blank" >GraphQL</List.Item>
              <List.Item href="https://expressjs.com/" target="_blank" >Express</List.Item>
              <List.Item href="https://github.com/expressjs/compression" target="_blank" >compression</List.Item>
              <List.Item href="https://github.com/eleith/emailjs" target="_blank" >emailjs</List.Item>
              <List.Item href="https://nodemon.io/" target="_blank" >nodemon</List.Item>
              <List.Item href="http://passportjs.org/" target="_blank" >Passport</List.Item>
              <List.Item href="http://docs.sequelizejs.com/en/v3/" target="_blank" >sequelize</List.Item>
              <List.Item href="https://github.com/halt-hammerzeit/javascript-time-ago" target="_blank" >javascript-time-ago</List.Item>
              <List.Item href="https://github.com/marak/Faker.js/" target="_blank" >faker.js</List.Item>
              <List.Item href="https://github.com/expressjs/multer" target="_blank" >multer</List.Item>
              <List.Item href="https://jdenticon.com/js-get-started.html" target="_blank" >jdenticon</List.Item>
              <List.Item href="https://github.com/nfl/react-helmet" target="_blank" >react-helmet</List.Item>
              <List.Item href="https://github.com/tsayen/dom-to-image" target="_blank" >dom-to-image</List.Item>
              <List.Item href="https://github.com/terikon/gif.js.optimized" target="_blank" >gif.js.optimized</List.Item>

            </List>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}
