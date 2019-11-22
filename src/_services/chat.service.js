// @flow week
import {API_URL, headerConfig} from '../_config'
import {authHeader} from '../_helpers'
import handleResponse from './handleResponse'

const saveComment = (formData: formType) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/saveComment`, requestOptions)
    .then(handleResponse)
    .then(chat => {
      return chat
    })
}

const getComment = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getComment`, requestOptions)
    .then(handleResponse)
    .then(chats => {
      return chats
    })
}

export const chatService = {
  getComment,
  saveComment
}
