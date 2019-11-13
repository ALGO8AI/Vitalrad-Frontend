// @flow week
import {combineReducers} from 'redux'

import {authentication} from './authentication.reducer'
import {category} from './category.reducer'
import {alert} from './alert.reducer'

const rootReducer = combineReducers({
  authentication,
  alert,
  category,
})

export default rootReducer
