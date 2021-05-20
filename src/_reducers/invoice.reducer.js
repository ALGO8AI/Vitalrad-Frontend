// @flow
import {invoiceConstants} from '../_constants'

const initialState = {}

type ActionType = {
}

type StateType = {}

export const invoice = (
  state: StateType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case invoiceConstants.INVOICE_INFO_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.invoice,
      }
    case invoiceConstants.INVOICE_INFO_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        ...action.invoice,
      }
    case invoiceConstants.INVOICE_INFO_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    default:
      return state
  }
}
