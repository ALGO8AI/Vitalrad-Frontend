//@flow
import {auditConstants} from '../_constants'
import {auditService} from '../_services'
import {alertActions} from './'

const getAuditInfo = (formData: Object) => (dispatch: any) => {
  const request = audits => ({
    type: auditConstants.AUDIT_INFO_REQUEST,
    audits,
  })
  const success = audits => ({
    type: auditConstants.AUDIT_INFO_SUCCESS,
    audits,
  })
  const failure = error => ({
    type: auditConstants.AUDIT_INFO_FAILURE,
    error,
  })
  dispatch(request([]))

  auditService.getAuditInfo(formData).then(
    audits => {
      dispatch(success(audits))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const getAuditByCategory = (formData: Object) => (dispatch: any) => {
  const request = auditlist => ({
    type: auditConstants.AUDIT_CATEGORY_DATA_REQUEST,
    auditlist,
  })
  const success = auditlist => ({
    type: auditConstants.AUDIT_CATEGORY_DATA_SUCCESS,
    auditlist,
  })
  const failure = error => ({
    type: auditConstants.AUDIT_CATEGORY_DATA_FAILURE,
    error,
  })
  dispatch(request([]))

  auditService.getAuditByCategory(formData).then(
    auditlist => {
      dispatch(success(auditlist))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const getAuditFilters = () => (dispatch: any) => {
  const request = auditfilters => ({
    type: auditConstants.AUDIT_FILTER_REQUEST,
    auditfilters,
  })
  const success = auditfilters => ({
    type: auditConstants.AUDIT_FILTER_SUCCESS,
    auditfilters,
  })
  const failure = error => ({
    type: auditConstants.AUDIT_FILTER_FAILURE,
    error,
  })
  dispatch(request([]))

  auditService.getAuditFilters().then(
    auditfilters => {
      dispatch(success(auditfilters))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}
export const auditActions = {
  getAuditInfo,
  getAuditFilters,
  getAuditByCategory
}
