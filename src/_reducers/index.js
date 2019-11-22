// @flow week
import {combineReducers} from 'redux'

import {authentication} from './authentication.reducer'
import {category} from './category.reducer'
import {discrepancy} from './discrepancy.reducer'
import {chat} from './chat.reducer'
import {alert} from './alert.reducer'

const rootReducer = combineReducers({
  authentication,
  alert,
  category,
  discrepancy,
  chat
})

export default rootReducer
