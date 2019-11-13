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

  return fetch(`${API_URL}/api/category`, requestOptions)
    .then(handleResponse)
    .then(category => {
      return category
    })
}

const updateDetail = (formData: formType, categoryId: string) => {
  const requestOptions = {
    method: 'PUT',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
    body: JSON.stringify(formData),
  }

  return fetch(`${API_URL}/api/category/${categoryId}`, requestOptions)
    .then(handleResponse)
    .then(category => {
      return category
    })
}

const listing = () => {
  const requestOptions = {
    method: 'GET',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
  }

  return fetch(`${API_URL}/api/category`, requestOptions)
    .then(handleResponse)
    .then(category => {
      return category
    })
}

const fetchCategoryWithHobby = () => {
  const requestOptions = {
    method: 'POST',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
  }

  return fetch(`${API_URL}/api/category/fetchHobbyByCategory`, requestOptions)
    .then(handleResponse)
    .then(category => {
      return category
    })
}

const detail = (categoryId: string) => {
  const requestOptions = {
    method: 'GET',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
  }

  return fetch(`${API_URL}/api/category/${categoryId}`, requestOptions)
    .then(handleResponse)
    .then((response: any) => {
      return response.category
    })
}

const deleteRecord = (categoryId: string) => {
  const requestOptions = {
    method: 'DELETE',
    headers: {...headerConfig.headerData, ...authHeader()},
    mode: 'cors',
  }

  return fetch(`${API_URL}/api/category/${categoryId}`, requestOptions)
    .then(handleResponse)
    .then((response: any) => {
      return response.message
    })
}

export const categoryService = {
  create,
  listing,
  detail,
  deleteRecord,
  updateDetail,
  fetchCategoryWithHobby,
}
