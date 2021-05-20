// @flow
import {modalityConstants} from '../_constants'

const initialState = {}

type ActionType = {
  type: string,
  modality: any,
  modalitys: any,
  modalityDetail: any,
  modalityDeleted: boolean,
}

type StateType = {}

export const modality = (
  state: StateType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case modalityConstants.MODALITY_CREATE_REQUEST:
      return {
        ...state,
        isProcessing: true,
        ...action.modality,
      }
    case modalityConstants.MODALITY_CREATE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        ...action.modality,
      }
    case modalityConstants.MODALITY_CREATE_FAILURE:
      return {
        ...state,
        isProcessing: false,
      }
    case modalityConstants.MODALITY_UPDATE_REQUEST:
      return {
        ...state,
        isProcessing: true,
        ...action.modality,
      }
    case modalityConstants.MODALITY_UPDATE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        modalityDetail: action.modality,
      }
    case modalityConstants.MODALITY_UPDATE_FAILURE:
      return {
        ...state,
        isProcessing: false,
      }
    case modalityConstants.MODALITY_LISTING_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.modalitys,
      }
    case modalityConstants.MODALITY_LISTING_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        ...action.modalitys,
      }
    case modalityConstants.MODALITY_LISTING_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case modalityConstants.MODALITY_DETAIL_REQUEST:
      return {
        ...state,
      }
    case modalityConstants.MODALITY_DETAIL_SUCCESS:
      return {
        ...state,
        modalityDetail: action.modalityDetail,
      }
    case modalityConstants.MODALITY_DETAIL_FAILURE:
      return {
        ...state,
      }
    case modalityConstants.MODALITY_DELETE_REQUEST:
      return {
        ...state,
      }
    case modalityConstants.MODALITY_DELETE_SUCCESS:
      return {
        ...state,
        modalityDeleted: true,
        modalityDetail: action.modalityDetail,
      }
    case modalityConstants.MODALITY_DELETE_FAILURE:
      return {
        ...state,
      }
    default:
      return state
  }
}
