// @flow
import {userConstants} from '../_constants'
import {userService} from '../_services'
import {history} from '../_helpers'
import {alertActions} from './'

const login = (username: string, password: string) => (dispatch: any) => {
  const request = user => ({type: userConstants.LOGIN_REQUEST, user})
  const success = user => ({type: userConstants.LOGIN_SUCCESS, user})
  const failure = error => ({type: userConstants.LOGIN_FAILURE, error})
  dispatch(request({username}))

  userService.login(username, password).then(
    user => {
      if(user.status){
        dispatch(success(user))
        history.push('/dashboard')
      }
      else
      {
        dispatch(failure(user.error.toString()))
        dispatch(alertActions.error(user.error.toString()))
      }
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const logout = () => {
  userService.logout()
  return {type: userConstants.LOGOUT}
}

export const userActions = {
  login,
  logout,
}
