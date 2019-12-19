// @flow
import {DiscrepancyList} from '../views/DiscrepancyPage'
import {AuditReport} from '../views/AuditPage'
import {HomePage} from '../views/HomePage'
import {AccountPage} from '../views/UserPage'
import {HospitalPage, HospitalFormPage} from '../views/HospitalPage'
import {DoctorPage, DoctorFormPage} from '../views/DoctorPage'
import {RadiologistPage, RadiologistFormPage} from '../views/RadiologistPage'

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
  doctor: {
    component: DoctorPage,
    path: '/doctor',
    roles: ['admin'],
  },
  addDoctor: {
    component: DoctorFormPage,
    path: '/doctor/create',
    roles: ['admin'],
  },
  hospital: {
    component: HospitalPage,
    path: '/hospital',
    roles: ['admin'],
  },
  addHospital: {
    component: HospitalFormPage,
    path: '/hospital/create',
    roles: ['admin'],
  },
  radiologist: {
    component: RadiologistPage,
    path: '/radiologist',
    roles: ['admin'],
  },
  addRadiologist: {
    component: RadiologistFormPage,
    path: '/radiologist/create',
    roles: ['admin'],
  },
  account: {
    component: AccountPage,
    path: '/account',
  },
}
