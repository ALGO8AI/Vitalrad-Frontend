// @flow week
export const authHeader = () => {
  // return authorization header with jwt token
  let user = {}
  let tmpItem = localStorage.getItem('_bloomauth')
  if (tmpItem) {
    user = JSON.parse(tmpItem)
  }

  if (user && user.token) {
    return {Authorization: 'Bearer ' + user.token}
  } else {
    return {}
  }
}
