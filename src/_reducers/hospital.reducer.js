// @flow
import {hospitalConstants} from '../_constants'

const initialState = {}

type ActionType = {
  type: string,
  hospital: any,
  hospitals: any,
  hospitalDetail: any,
  hospitalDeleted: boolean,
}

type StateType = {}

export const hospital = (
  state: StateType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case hospitalConstants.HOSPITAL_CREATE_REQUEST:
      return {
        ...state,
        isProcessing: true,
        ...action.hospital,
      }
    case hospitalConstants.HOSPITAL_CREATE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        ...action.hospital,
      }
    case hospitalConstants.HOSPITAL_CREATE_FAILURE:
      return {
        ...state,
        isProcessing: false,
      }
    case hospitalConstants.HOSPITAL_UPDATE_REQUEST:
      return {
        ...state,
        isProcessing: true,
        ...action.hospital,
      }
    case hospitalConstants.HOSPITAL_UPDATE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        hospitalDetail: action.hospital,
      }
    case hospitalConstants.HOSPITAL_UPDATE_FAILURE:
      return {
        ...state,
        isProcessing: false,
      }
    case hospitalConstants.HOSPITAL_LISTING_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.hospitals,
      }
    case hospitalConstants.HOSPITAL_LISTING_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        ...action.hospitals,
      }
    case hospitalConstants.HOSPITAL_LISTING_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case hospitalConstants.HOSPITAL_DETAIL_REQUEST:
      return {
        ...state,
      }
    case hospitalConstants.HOSPITAL_DETAIL_SUCCESS:
      return {
        ...state,
        hospitalDetail: action.hospitalDetail,
      }
    case hospitalConstants.HOSPITAL_DETAIL_FAILURE:
      return {
        ...state,
      }
    case hospitalConstants.HOSPITAL_DELETE_REQUEST:
      return {
        ...state,
      }
    case hospitalConstants.HOSPITAL_DELETE_SUCCESS:
      return {
        ...state,
        hospitalDeleted: true,
        hospitalDetail: action.hospitalDetail,
      }
    case hospitalConstants.HOSPITAL_DELETE_FAILURE:
      return {
        ...state,
      }
    default:
      return state
  }
}
