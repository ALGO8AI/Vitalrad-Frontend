// @flow
import {discrepancyConstants} from '../_constants'

const initialState = {}

type ActionType = {
}

type StateType = {}

export const discrepancy = (
  state: StateType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case discrepancyConstants.DIS_LISTING_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.discrepancies,
      }
    case discrepancyConstants.DIS_LISTING_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        ...action.discrepancies,
      }
    case discrepancyConstants.DIS_LISTING_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case discrepancyConstants.ACCESSION_INFO_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
      }
    case discrepancyConstants.ACCESSION_INFO_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        accessioninfo : action.accessioninfo.detail || [],
      }
    case discrepancyConstants.ACCESSION_INFO_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case discrepancyConstants.Add_DISCREPANCY_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
      }
    case discrepancyConstants.Add_DISCREPANCY_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        raiseDisInfo : action.accessioninfo || [],
      }
    case discrepancyConstants.Add_DISCREPANCY_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case discrepancyConstants.UPDATE_DISCREPANCY_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
      }
    case discrepancyConstants.UPDATE_DISCREPANCY_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        raiseDisInfo : action.accessioninfo || [],
      }
    case discrepancyConstants.UPDATE_DISCREPANCY_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case discrepancyConstants.UPDATE_FEEDBACK_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
      }
    case discrepancyConstants.UPDATE_FEEDBACK_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        raiseDisInfo : action.accessioninfo || [],
      }
    case discrepancyConstants.UPDATE_FEEDBACK_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case discrepancyConstants.NOTIFY_LISTING_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.discrepancies,
      }
    case discrepancyConstants.NOTIFY_LISTING_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        ...action.discrepancies,
        notices : action.discrepancies.detail || [],
      }
    case discrepancyConstants.NOTIFY_LISTING_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case discrepancyConstants.NOTIFY_UPDATE_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.discrepancies,
      }
    case discrepancyConstants.NOTIFY_UPDATE_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        notices : action.discrepancies.detail || [],
      }
    case discrepancyConstants.NOTIFY_UPDATE_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    default:
      return state
  }
}
