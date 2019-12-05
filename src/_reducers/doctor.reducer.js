// @flow
import {doctorConstants} from '../_constants'

const initialState = {}

type ActionType = {
  type: string,
  doctor: any,
  doctors: any,
  doctorDetail: any,
  doctorDeleted: boolean,
}

type StateType = {}

export const doctor = (state: StateType = initialState, action: ActionType) => {
  switch (action.type) {
    case doctorConstants.DOCTOR_CREATE_REQUEST:
      return {
        ...state,
        isProcessing: true,
        ...action.doctor,
      }
    case doctorConstants.DOCTOR_CREATE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        ...action.doctor,
      }
    case doctorConstants.DOCTOR_CREATE_FAILURE:
      return {
        ...state,
        isProcessing: false,
      }
    case doctorConstants.DOCTOR_UPDATE_REQUEST:
      return {
        ...state,
        isProcessing: true,
        ...action.doctor,
      }
    case doctorConstants.DOCTOR_UPDATE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        doctorDetail: action.doctor.doctor,
      }
    case doctorConstants.DOCTOR_UPDATE_FAILURE:
      return {
        ...state,
        isProcessing: false,
      }
    case doctorConstants.DOCTOR_LISTING_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.doctors,
      }
    case doctorConstants.DOCTOR_LISTING_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        ...action.doctors,
      }
    case doctorConstants.DOCTOR_LISTING_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case doctorConstants.DOCTOR_DETAIL_REQUEST:
      return {
        ...state,
      }
    case doctorConstants.DOCTOR_DETAIL_SUCCESS:
      return {
        ...state,
        doctorDetail: action.doctorDetail,
      }
    case doctorConstants.DOCTOR_DETAIL_FAILURE:
      return {
        ...state,
      }
    case doctorConstants.DOCTOR_DELETE_REQUEST:
      return {
        ...state,
      }
    case doctorConstants.DOCTOR_DELETE_SUCCESS:
      return {
        ...state,
        doctorDeleted: true,
        doctorDetail: action.doctorDetail,
      }
    case doctorConstants.DOCTOR_DELETE_FAILURE:
      return {
        ...state,
      }
    default:
      return state
  }
}
