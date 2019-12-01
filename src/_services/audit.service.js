// @flow week
import {API_URL, headerConfig} from '../_config'
import {authHeader} from '../_helpers'
import handleResponse from './handleResponse'

const getAuditInfo = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getAuditInfo`, requestOptions)
    .then(handleResponse)
    .then(audit => {
      return audit
    })
}

const getAuditByCategory = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getAuditByCategory`, requestOptions)
    .then(handleResponse)
    .then(audit => {
      return audit
    })
}

const getAuditFilters = (formData : Object = {}) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getAuditFilters`, requestOptions)
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const auditService = {
  getAuditInfo,
  getAuditFilters,
  getAuditByCategory
}
