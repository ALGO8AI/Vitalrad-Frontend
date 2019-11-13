// @flow
import {userConstants} from '../_constants'
import {userService} from '../_services'
import {history} from '../_helpers'

const login = (email: string, password: string) => (dispatch: any) => {
  const request = user => ({type: userConstants.LOGIN_REQUEST, user})
  const success = user => ({type: userConstants.LOGIN_SUCCESS, user})
  // const failure = error => ({type: userConstants.LOGIN_FAILURE, error})
  dispatch(request({email}))

  const user = userService.login(email, password)
  dispatch(success(user))
  history.push('/dashboard')
}

const logout = () => {
  userService.logout()
  return {type: userConstants.LOGOUT}
}

export const userActions = {
  login,
  logout,
}
