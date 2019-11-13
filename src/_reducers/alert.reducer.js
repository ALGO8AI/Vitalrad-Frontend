// @flow week
import {alertConstants} from '../_constants'

type ActionType = {
  type: string,
  message: any,
}

type StateType = {}

export const alert = (state: StateType = {}, action: ActionType) => {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: 'alert-success',
        message: action.message,
      }
    case alertConstants.ERROR:
      return {
        type: 'alert-danger',
        message: action.message,
      }
    case alertConstants.CLEAR:
      return {}
    default:
      return state
  }
}
