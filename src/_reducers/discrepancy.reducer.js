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
    default:
      return state
  }
}
