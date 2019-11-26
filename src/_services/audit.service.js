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

export const auditService = {
  getAuditInfo,
}
