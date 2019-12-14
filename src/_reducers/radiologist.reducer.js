// @flow
import {radiologistConstants} from '../_constants'

const initialState = {}

type ActionType = {
  type: string,
  radiologist: any,
  radiologists: any,
  radiologistDetail: any,
  radiologistDeleted: boolean,
}

type StateType = {}

export const radiologist = (
  state: StateType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case radiologistConstants.RADIO_CREATE_REQUEST:
      return {
        ...state,
        isProcessing: true,
        ...action.radiologist,
      }
    case radiologistConstants.RADIO_CREATE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        ...action.radiologist,
      }
    case radiologistConstants.RADIO_CREATE_FAILURE:
      return {
        ...state,
        isProcessing: false,
      }
    case radiologistConstants.RADIO_UPDATE_REQUEST:
      return {
        ...state,
        isProcessing: true,
        ...action.radiologist,
      }
    case radiologistConstants.RADIO_UPDATE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        radiologistDetail: action.radiologist,
      }
    case radiologistConstants.RADIO_UPDATE_FAILURE:
      return {
        ...state,
        isProcessing: false,
      }
    case radiologistConstants.RADIO_LISTING_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.radiologists,
      }
    case radiologistConstants.RADIO_LISTING_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        ...action.radiologists,
      }
    case radiologistConstants.RADIO_LISTING_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case radiologistConstants.RADIO_DETAIL_REQUEST:
      return {
        ...state,
      }
    case radiologistConstants.RADIO_DETAIL_SUCCESS:
      return {
        ...state,
        radiologistDetail: action.radiologistDetail,
      }
    case radiologistConstants.RADIO_DETAIL_FAILURE:
      return {
        ...state,
      }
    case radiologistConstants.RADIO_DELETE_REQUEST:
      return {
        ...state,
      }
    case radiologistConstants.RADIO_DELETE_SUCCESS:
      return {
        ...state,
        radiologistDeleted: true,
        radiologistDetail: action.radiologistDetail,
      }
    case radiologistConstants.RADIO_DELETE_FAILURE:
      return {
        ...state,
      }
    default:
      return state
  }
}
