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

const getAuditFilters = (filterData: Object) => (dispatch: any) => {
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

  auditService.getAuditFilters(filterData).then(
    auditfilters => {
      dispatch(success(auditfilters))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const updateAuditStatus = (formData: Object) => (dispatch: any) => {
  const request = astatus => ({type: auditConstants.NOTICE_STATUS_REQUEST, astatus})
  const success = astatus => ({type: auditConstants.NOTICE_STATUS_SUCCESS, astatus})
  const failure = error => ({type: auditConstants.NOTICE_STATUS_FAILURE, error})

  dispatch(request(formData))

  auditService.updateAuditStatus(formData).then(
    astatus => {
      if(astatus.status){
        dispatch(success(astatus))
        let message = astatus.message
        dispatch(alertActions.success(message.toString()))
      }
      else
      {
        dispatch(failure(astatus.message.toString()))
        dispatch(alertActions.error(astatus.message.toString())) 
      }
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const getDashBoaordInfo = (formData: Object) => (dispatch: any) => {
  const request = dashboardInfo => ({
    type: auditConstants.DASHBOARD_INFO_REQUEST,
    dashboardInfo,
  })
  const success = dashboardInfo => ({
    type: auditConstants.DASHBOARD_INFO_SUCCESS,
    dashboardInfo,
  })
  const failure = error => ({
    type: auditConstants.DASHBOARD_INFO_FAILURE,
    error,
  })
  dispatch(request([]))

  auditService.getDashBoaordInfo(formData).then(
    dashboardInfo => {
      dispatch(success(dashboardInfo))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const getActivityInfo = (formData: Object) => (dispatch: any) => {
  const request = activityInfo => ({
    type: auditConstants.ACTIVITY_INFO_REQUEST,
    activityInfo,
  })
  const success = activityInfo => ({
    type: auditConstants.ACTIVITY_INFO_SUCCESS,
    activityInfo,
  })
  const failure = error => ({
    type: auditConstants.ACTIVITY_INFO_FAILURE,
    error,
  })
  dispatch(request([]))

  auditService.getActivityInfo(formData).then(
    activityInfo => {
      dispatch(success(activityInfo))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const getActivityLineGraph = (formData: Object) => (dispatch: any) => {
  const request = activityInfo => ({
    type: auditConstants.ACTIVITY_INFO_REQUEST,
    activityInfo,
  })
  const success = activityInfo => ({
    type: auditConstants.ACTIVITY_INFO_SUCCESS,
    activityInfo,
  })
  const failure = error => ({
    type: auditConstants.ACTIVITY_INFO_FAILURE,
    error,
  })
  dispatch(request([]))

  auditService.getActivityLineGraph(formData).then(
    activityInfo => {
      dispatch(success(activityInfo))
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
  getAuditByCategory,
  updateAuditStatus,
  getDashBoaordInfo,
  getActivityInfo,
  getActivityLineGraph
}
