// @flow
import {chatConstants} from '../_constants'

const initialState = {}

type ActionType = {
  type: string,
  chat: any,
  chats: any,
}

type StateType = {}

export const chat = (
  state: StateType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case chatConstants.CHAT_CREATE_REQUEST:
      return {
        ...state,
        isProcessing: true,
        ...action.chat,
      }
    case chatConstants.CHAT_CREATE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        ...action.chat,
      }
    case chatConstants.CHAT_CREATE_FAILURE:
      return {
        ...state,
        isProcessing: false,
      }
    case chatConstants.CHAT_LISTING_REQUEST:
      return {
        ...state,
        isDataProcessing: true,
        ...action.chats,
      }
    case chatConstants.CHAT_LISTING_SUCCESS:
      return {
        ...state,
        isDataProcessing: false,
        ...action.chats.data,
      }
    case chatConstants.CHAT_LISTING_FAILURE:
      return {
        ...state,
        isDataProcessing: false,
      }
    default:
      return state
  }
}
