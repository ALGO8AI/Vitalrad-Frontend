// @flow
import {
  UserList,
} from '../views/UserPage'

import {
  HomePage,
} from '../views/HomePage'

export const PrivateRouteLinks = {
  dashboard: {
    component: HomePage,
    path: '/dashboard',
    roles: ['admin'],
  },
  user: {
    component: UserList,
    path: '/users',
    roles: ['admin'],
  },
}
