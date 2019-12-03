// @flow
import {
  DiscrepancyList,
} from '../views/DiscrepancyPage'

import {
  AuditReport,
} from '../views/AuditPage'


import {
  HomePage,
} from '../views/HomePage'

export const PrivateRouteLinks = {
  dashboard: {
    component: HomePage,
    path: '/dashboard',
    roles: ['admin'],
  },
  discrepancy: {
    component: DiscrepancyList,
    path: '/discrepancy',
    roles: ['admin'],
  },
  publicdiscrepancy: {
    component: DiscrepancyList,
    path: '/publicdiscrepancy',
    roles: [],
  },
  auditreport: {
    component: AuditReport,
    path: '/audit',
    roles: ['admin'],
  },
  publicauditreport: {
    component: AuditReport,
    path: '/publicaudit',
    roles: [],
  },
}
