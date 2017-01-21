
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import board from '../ducks/board'
import login from '../ducks/login'

export default combineReducers({
  routing,
  board,
  login,
})
