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
        let errorMsg = user.error || user.message
        dispatch(failure(errorMsg.toString()))
        dispatch(alertActions.error(errorMsg.toString()))
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

const getUser = (formData: Object) => (dispatch: any) => {
  const request = userInfo => ({
    type: userConstants.USER_DETAIL_REQUEST,
    userInfo,
  })
  const success = userInfo => ({
    type: userConstants.USER_DETAIL_SUCCESS,
    userInfo,
  })
  const failure = error => ({type: userConstants.USER_DETAIL_FAILURE, error})
  dispatch(request({}))

  userService.getUser(formData).then(
    response => {
      dispatch(success(response))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

export const userActions = {
  login,
  logout,
  getUser
}
