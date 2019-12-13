// @flow week
import {API_URL, headerConfig} from '../_config'
import {authHeader} from '../_helpers'
import handleResponse from './handleResponse'

type formType = {
  name: string,
  description: string,
}

const create = (formData: formType) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/signup`, requestOptions)
    .then(handleResponse)
    .then(hospital => {
      return hospital
    })
}

const updateDetail = (formData: formType, hospitalId: string) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/updateProfile`, requestOptions)
    .then(handleResponse)
    .then(hospital => {
      return hospital
    })
}

const listing = (formData: formType) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getProfiles`, requestOptions)
    .then(handleResponse)
    .then(hospital => {
      return hospital
    })
}


const detail = (formData: Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getProfile`, requestOptions)
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

  return fetch(`${API_URL}/removeUser`, requestOptions)
    .then(handleResponse)
    .then((response: any) => {
      return response.message
    })
}

export const hospitalService = {
  create,
  listing,
  detail,
  deleteRecord,
  updateDetail,
}
