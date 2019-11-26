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

export const auditActions = {
  getAuditInfo,
}
