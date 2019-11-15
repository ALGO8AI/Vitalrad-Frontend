// @flow
import {
  DiscrepancyList,
} from '../views/DiscrepancyPage'

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
    component: DiscrepancyList,
    path: '/discrepancy',
    roles: ['admin'],
  },
}
