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
    default:
      return state
  }
}
