// @flow
import {auditConstants} from '../_constants'

const initialState = {}

type ActionType = {
}

type StateType = {}

export const audit = (
  state: StateType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case auditConstants.AUDIT_INFO_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.audits,
      }
    case auditConstants.AUDIT_INFO_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        ...action.audits,
      }
    case auditConstants.AUDIT_INFO_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case auditConstants.AUDIT_CATEGORY_DATA_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.auditlist,
      }
    case auditConstants.AUDIT_CATEGORY_DATA_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        auditlist: action.auditlist.data.detail || [],
      }
    case auditConstants.AUDIT_CATEGORY_DATA_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case auditConstants.AUDIT_FILTER_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.auditfilters,
      }
    case auditConstants.AUDIT_FILTER_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        auditfilters: action.auditfilters.data.detail || [],
      }
    case auditConstants.AUDIT_FILTER_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case auditConstants.NOTICE_STATUS_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.astatus,
      }
    case auditConstants.NOTICE_STATUS_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        ...action.astatus,
      }
    case auditConstants.NOTICE_STATUS_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case auditConstants.DASHBOARD_INFO_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.dashboardInfo,
      }
    case auditConstants.DASHBOARD_INFO_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        dashboardInfo : action.dashboardInfo.detail,
      }
    case auditConstants.DASHBOARD_INFO_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case auditConstants.ACTIVITY_INFO_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        activityInfo: {},
      }
    case auditConstants.ACTIVITY_INFO_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        activityInfo : action.activityInfo.detail,
      }
    case auditConstants.ACTIVITY_INFO_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    default:
      return state
  }
}
