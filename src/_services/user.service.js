// @flow week
import {API_URL, headerConfig} from '../_config'
import {history, authHeader} from '../_helpers'
import handleResponse from './handleResponse'

const login = (username: string, password: string) => {
  const requestOptions = {
    method: 'POST',
    headers: headerConfig.headerData,
    mode: 'cors',
    body: JSON.stringify({
      username,
      password,
    }),
  }

  return fetch(`${API_URL}/login`, requestOptions)
    .then(handleResponse)
    .then(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      if(user.status){
        localStorage.setItem('_radioauth', JSON.stringify(user))
      }
      return user
    })
}

const logout = () => {
  // remove user from local storage to log user out
  localStorage.removeItem('_radioauth')
  history.push('/')
}

const getUser = (formData: Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getUser`, requestOptions)
    .then(handleResponse)
    .then((response: any) => {
      return response.detail
    })
}
export const userService = {
  login,
  logout,
  getUser
}
