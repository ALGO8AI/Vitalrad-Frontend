// @flow week
import {history} from '../_helpers'

const login = (email: string, password: string) => {
  const user = {
    email: email,
    name: 'vinod',
    token: 'sdfsdfsfw4643636346346rrtgr1qaqe'
  }

  localStorage.setItem('_radioauth', JSON.stringify(user))
  return user
}

const logout = () => {
  // remove user from local storage to log user out
  localStorage.removeItem('_radioauth')
  history.push('/')
}

export const userService = {
  login,
  logout,
}
