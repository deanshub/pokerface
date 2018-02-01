//@flow

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Modal, {ModalHeader,ModalContent} from '../../components/basic/Modal'

@inject('auth')
@observer
export default class OpensourceModal extends Component {
  render() {
    const {auth} = this.props

    return (
      <Modal
          closeOnBlur
          onClose={()=>{auth.opensourceModalOpen=false}}
          open={auth.opensourceModalOpen}
      >
        <ModalHeader>Opensource Software used in Pokerface.io</ModalHeader>
        <ModalContent>
            <ul>
              <li href="https://nodejs.org/en/" target="_blank" >nodeJs</li>
              <li href="https://www.postgresql.org/" target="_blank" >Postgres</li>
              <li href="https://babeljs.io/" target="_blank" >Babel</li>
              <li href="https://facebook.github.io/react/" target="_blank" >React</li>
              <li href="https://github.com/JedWatson/classnames" target="_blank" >classnames</li>
              <li href="https://webpack.github.io/" target="_blank" >webpack</li>
              <li href="https://flowtype.org/" target="_blank" >flowtype</li>
              <li href="https://mobx.js.org/" target="_blank" >mobx</li>
              <li href="http://postcss.org/" target="_blank" >postcss</li>
              <li href="https://jonathantneal.github.io/precss/" target="_blank" >precss</li>
              <li href="http://gaearon.github.io/react-hot-loader/" target="_blank" >React Hot Loader</li>
              <li href="https://reacttraining.com/react-router/" target="_blank" >React Router</li>
              <li href="https://momentjs.com/" target="_blank" >Moment</li>
              <li href="http://ramdajs.com/" target="_blank" >Ramda</li>
              <li href="https://github.com/YouCanBookMe/react-datetime" target="_blank" >React Datetime</li>
              <li href="http://recharts.org/" target="_blank" >Recharts</li>
              <li href="http://selfthinker.github.io/CSS-Playing-Cards/" target="_blank" >css playing cards</li>
              <li href="http://visionmedia.github.io/superagent/" target="_blank" >SuperAgent</li>
              <li href="http://graphql.org/" target="_blank" >GraphQL</li>
              <li href="https://expressjs.com/" target="_blank" >Express</li>
              <li href="https://github.com/expressjs/compression" target="_blank" >compression</li>
              <li href="https://github.com/eleith/emailjs" target="_blank" >emailjs</li>
              <li href="https://nodemon.io/" target="_blank" >nodemon</li>
              <li href="http://passportjs.org/" target="_blank" >Passport</li>
              <li href="http://docs.sequelizejs.com/en/v3/" target="_blank" >sequelize</li>
              <li href="https://github.com/halt-hammerzeit/javascript-time-ago" target="_blank" >javascript-time-ago</li>
              <li href="https://github.com/marak/Faker.js/" target="_blank" >faker.js</li>
              <li href="https://github.com/expressjs/multer" target="_blank" >multer</li>
              <li href="https://jdenticon.com/js-get-started.html" target="_blank" >jdenticon</li>
              <li href="https://github.com/nfl/react-helmet" target="_blank" >react-helmet</li>
              <li href="https://github.com/tsayen/dom-to-image" target="_blank" >dom-to-image</li>
              <li href="https://github.com/terikon/gif.js.optimized" target="_blank" >gif.js.optimized</li>
            </ul>
        </ModalContent>
      </Modal>
    )
  }
}
