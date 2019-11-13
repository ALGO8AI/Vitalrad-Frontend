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
    let bloomauth = localStorage.getItem('_bloomauth')
      ? localStorage.getItem('_bloomauth')
      : '{}'
    let tmpToken = bloomauth ? JSON.parse(bloomauth) : null

    return tmpToken && tmpToken.token ? decode(tmpToken.token) : false
  } catch (err) {
    return false
  }
}

export const isOrganization = () => {
  try {
    const authData = tokenDetail()
    let orgId = false
    if (idx(authData, _ => _.orgId) && authData.orgId !== '') {
      orgId = authData.orgId
    }
    return orgId
  } catch (err) {
    return false
  }
}
