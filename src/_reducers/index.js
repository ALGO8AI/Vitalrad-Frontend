// @flow week
import {combineReducers} from 'redux'

import {authentication} from './authentication.reducer'
import {hospital} from './hospital.reducer'
import {doctor} from './doctor.reducer'
import {discrepancy} from './discrepancy.reducer'
import {chat} from './chat.reducer'
import {audit} from './audit.reducer'
import {radiologist} from './radiologist.reducer'
import {alert} from './alert.reducer'
import {invoice} from './invoice.reducer'
import {modality} from './modality.reducer'

const rootReducer = combineReducers({
  authentication,
  alert,
  doctor,
  hospital,
  discrepancy,
  chat,
  audit,
  radiologist,
  invoice,
  modality
})

export default rootReducer
