// @flow week
import decode from 'jwt-decode'
import idx from 'idx'

export const isTokenExpired = (token: string) => {
  try {
    const decoded = decode(token)
    // Checking if token is expired.
    return decoded.exp < Date.now() / 1000 ? true : false
  } catch (err) {
    return false
  }
}

export const tokenDetail = () => {
  try {
    let radioauth = localStorage.getItem('_radioauth')
      ? localStorage.getItem('_radioauth')
      : '{}'
    let tmpToken = radioauth ? JSON.parse(radioauth) : null

    return tmpToken && tmpToken.token ? decode(tmpToken.token) : false
  } catch (err) {
    return false
  }
}


export const authDetail = () => {
  try {
    let radioauth = localStorage.getItem('_radioauth')
      ? localStorage.getItem('_radioauth')
      : '{}'
    let authData = radioauth ? JSON.parse(radioauth) : null
    return authData
  } catch (err) {
    return null
  }
}

export const isAdmin = () => {
  try {
    let radioauth = localStorage.getItem('_radioauth')
      ? localStorage.getItem('_radioauth')
      : '{}'
    let authData = radioauth ? JSON.parse(radioauth) : null
    let isAdmin = false
    if (idx(authData, _ => _.detail) && authData.detail.user_type === 'superadmin') {
      isAdmin = true
    }
    return isAdmin
  } catch (err) {
    return false
  }
}

export const isAdminHospital = () => {
  try {
    let radioauth = localStorage.getItem('_radioauth')
      ? localStorage.getItem('_radioauth')
      : '{}'
    let authData = radioauth ? JSON.parse(radioauth) : null
    let isAdmin = false
    if (idx(authData, _ => _.detail) && (authData.detail.user_type === 'superadmin' || authData.detail.user_type === 'hospital')) {
      isAdmin = true
    }
    return isAdmin
  } catch (err) {
    return false
  }
}

export const loggedInUser = () => {
  try {
    let radioauth = localStorage.getItem('_radioauth')
      ? localStorage.getItem('_radioauth')
      : '{}'
    let authData = radioauth ? JSON.parse(radioauth) : null
    let userType = null
    if (idx(authData, _ => _.detail.user_type)) {
      userType = authData.detail.user_type
    }
    return userType
  } catch (err) {
    return false
  }
}