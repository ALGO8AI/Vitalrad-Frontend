// @flow week
import {API_URL, headerConfig} from '../_config'
import {authHeader} from '../_helpers'
import handleResponse from './handleResponse'

const getInvoiceDetail = (formData : Object) => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/getInvoice`, requestOptions)
    .then(handleResponse)
    .then(invoice => {
      return invoice
    })
}

export const invoiceService = {
  getInvoiceDetail,
}
