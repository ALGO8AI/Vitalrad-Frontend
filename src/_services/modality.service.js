// @flow week
import {API_URL, headerConfig} from '../_config'
import {authHeader} from '../_helpers'
import handleResponse from './handleResponse'

type formType = {
}

const create = (formData: formType) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/saveModality`, requestOptions)
    .then(handleResponse)
    .then(modality => {
      return modality
    })
}

const updateDetail = (formData: formType, modalityId: string) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/updateUpdate`, requestOptions)
    .then(handleResponse)
    .then(modality => {
      return modality
    })
}

const getModalities = (formData: formType) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getModalities`, requestOptions)
    .then(handleResponse)
    .then(modality => {
      return modality
    })
}


const detail = (formData: Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getModality`, requestOptions)
    .then(handleResponse)
    .then((response: any) => {
      return response.detail
    })
}

const deleteRecord = (formData: Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/removeModality`, requestOptions)
    .then(handleResponse)
    .then((response: any) => {
      return response.message
    })
}

export const modalityService = {
  create,
  getModalities,
  detail,
  deleteRecord,
  updateDetail,
}
