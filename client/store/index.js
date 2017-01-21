
import { createStore, applyMiddleware } from 'redux'

import { logger } from '../middleware'
import rootReducer from '../ducks'

export default function configure(initialState) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  const createStoreWithMiddleware = applyMiddleware(
    logger
  )(create)

  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    module.hot.accept('../ducks', () => {
      const nextReducer = require('../ducks')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
