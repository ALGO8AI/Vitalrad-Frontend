// @flow
import {DiscrepancyList} from '../views/DiscrepancyPage'
import {AuditReport} from '../views/AuditPage'
import {ActivityReport} from '../views/ActivityPage'
import {NoticeList} from '../views/NoticePage'
import {SaleList} from '../views/SalePage'
import {BillingList} from '../views/BillingPage'
import {HomePage} from '../views/HomePage'
import {AccountPage} from '../views/UserPage'
import {HospitalPage, HospitalFormPage} from '../views/HospitalPage'
import {DoctorPage, DoctorFormPage, DoctorList} from '../views/DoctorPage'
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
  activityreport: {
    component: ActivityReport,
    path: '/activity',
    roles: ['admin'],
  },
  notice: {
    component: NoticeList,
    path: '/notice',
    roles: ['admin'],
  },
  sale: {
    component: SaleList,
    path: '/sales',
    roles: ['admin'],
  },
  billing: {
    component: BillingList,
    path: '/billing',
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
  manageDoctor: {
    component: DoctorList,
    path: '/manage/doctor',
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
