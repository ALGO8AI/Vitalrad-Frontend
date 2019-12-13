// @flow
import {userConstants} from '../_constants'

let user = {}
let tmpItem = localStorage.getItem('_bloomauth')
if (tmpItem) {
  user = JSON.parse(tmpItem)
}
const initialState = user ? {loggedIn: true, user} : {}

type ActionType = {
  type: string,
  user: any,
}

type StateType = {}

export const authentication = (
  state: StateType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: false,
        user: action.user,
      }
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      }
    case userConstants.LOGIN_FAILURE:
      return {
        ...state,
        loggedIn: false,
      }
    case userConstants.LOGOUT:
      return {}
    default:
      return state
  }
}
