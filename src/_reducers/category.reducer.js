// @flow
import {categoryConstants} from '../_constants'

const initialState = {}

type ActionType = {
  type: string,
  category: any,
  categories: any,
  categoryDetail: any,
  categoryDeleted: boolean,
}

type StateType = {}

export const category = (
  state: StateType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case categoryConstants.CATEGORY_CREATE_REQUEST:
      return {
        ...state,
        isProcessing: true,
        ...action.category,
      }
    case categoryConstants.CATEGORY_CREATE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        ...action.category,
      }
    case categoryConstants.CATEGORY_CREATE_FAILURE:
      return {
        ...state,
        isProcessing: false,
      }
    case categoryConstants.CATEGORY_UPDATE_REQUEST:
      return {
        ...state,
        isProcessing: true,
        ...action.category,
      }
    case categoryConstants.CATEGORY_UPDATE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        categoryDetail: action.category,
      }
    case categoryConstants.CATEGORY_UPDATE_FAILURE:
      return {
        ...state,
        isProcessing: false,
      }
    case categoryConstants.CATEGORY_LISTING_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.categories,
      }
    case categoryConstants.CATEGORY_LISTING_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        ...action.categories,
      }
    case categoryConstants.CATEGORY_LISTING_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    case categoryConstants.CATEGORY_DETAIL_REQUEST:
      return {
        ...state,
      }
    case categoryConstants.CATEGORY_DETAIL_SUCCESS:
      return {
        ...state,
        categoryDetail: action.categoryDetail,
      }
    case categoryConstants.CATEGORY_DETAIL_FAILURE:
      return {
        ...state,
      }
    case categoryConstants.CATEGORY_DELETE_REQUEST:
      return {
        ...state,
      }
    case categoryConstants.CATEGORY_DELETE_SUCCESS:
      return {
        ...state,
        categoryDeleted: true,
        categoryDetail: action.categoryDetail,
      }
    case categoryConstants.CATEGORY_DELETE_FAILURE:
      return {
        ...state,
      }
    default:
      return state
  }
}
