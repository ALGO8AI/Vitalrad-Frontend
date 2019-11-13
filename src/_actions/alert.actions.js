// @flow
import {alertConstants} from '../_constants'

const success = (message: string) => ({type: alertConstants.SUCCESS, message})

const error = (message: string) => ({type: alertConstants.ERROR, message})

const clear = () => ({type: alertConstants.CLEAR})

export const alertActions = {
  success,
  error,
  clear,
}
