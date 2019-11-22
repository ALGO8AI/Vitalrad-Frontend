//@flow
import {chatConstants} from '../_constants'
import {chatService} from '../_services'
import {alertActions} from './'

type formType = {
}

const saveComment = (formData: formType) => (dispatch: any) => {
  const request = chat => ({
    type: chatConstants.CHAT_CREATE_REQUEST,
    chat,
  })

  const success = chat => ({
    type: chatConstants.CHAT_CREATE_SUCCESS,
    chat,
  })

  const failure = error => ({
    type: chatConstants.CHAT_CREATE_FAILURE,
    error,
  })
  dispatch(request(formData))

  chatService.saveComment(formData).then(
    chat => {
      dispatch(success(chat))
      let message = 'Message send successfully'
      dispatch(alertActions.success(message.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const getComment = (formData: object) => (dispatch: any) => {
  const request = chats => ({
    type: chatConstants.CHAT_LISTING_REQUEST,
    chats,
  })
  const success = chats => ({
    type: chatConstants.CHAT_LISTING_SUCCESS,
    chats,
  })
  const failure = error => ({
    type: chatConstants.CHAT_LISTING_FAILURE,
    error,
  })
  dispatch(request([]))

  chatService.getComment(formData).then(
    chats => {
      dispatch(success(chats))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

export const chatActions = {
  saveComment,
  getComment,
}
