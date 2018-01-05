import ReactDOM from 'react-dom'
import React from 'react'
import { AppContainer } from 'react-hot-loader'
import './general.css'

import App from './containers/App'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('root')
  )
}


render(App)

if (module.hot) {
  module.hot.accept()
  // module.hot.accept('./containers/App', () => {
  //   const App = require('./containers/App').default
  //   render(App)
  // })
}
