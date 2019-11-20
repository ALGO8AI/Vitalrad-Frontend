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

export const discrepancyService = {
  listing,
}
