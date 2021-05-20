// @flow week
import {API_URL, headerConfig} from '../_config'
import {authHeader} from '../_helpers'
import handleResponse from './handleResponse'

const listing = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getDiscrepencyData`, requestOptions)
    .then(handleResponse)
    .then(discrepancy => {
      return discrepancy
    })
}

const getAccessionDetail = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getDiscrepencyData`, requestOptions)
    .then(handleResponse)
    .then(discrepancy => {
      return discrepancy
    })
}

const createDiscrepancy = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/updateDiscrepency`, requestOptions)
    .then(handleResponse)
    .then(discrepancy => {
      return discrepancy
    })
}

const updateDiscrepencyStatus = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/updateDiscrepencyStatus`, requestOptions)
    .then(handleResponse)
    .then(discrepancy => {
      return discrepancy
    })
}

const updateFeedback = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/updateFeedback`, requestOptions)
    .then(handleResponse)
    .then(discrepancy => {
      return discrepancy
    })
}

const getNotifications = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getNotifications`, requestOptions)
    .then(handleResponse)
    .then(discrepancy => {
      return discrepancy
    })
}
const updateNotifications = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/updateNotifications`, requestOptions)
    .then(handleResponse)
    .then(discrepancy => {
      return discrepancy
    })
}

const discrepencyFinalReview = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/discrepencyFinalReview`, requestOptions)
    .then(handleResponse)
    .then(discrepancy => {
      return discrepancy
    })
}

export const discrepancyService = {
  listing,
  getAccessionDetail,
  createDiscrepancy,
  updateDiscrepencyStatus,
  updateFeedback,
  getNotifications,
  updateNotifications,
  discrepencyFinalReview
}
