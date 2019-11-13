//@flow
import {categoryConstants} from '../_constants'
import {categoryService} from '../_services'
import {alertActions} from './'
import {history} from '../_helpers'

type formType = {
  name: string,
  description: string,
}

const create = (formData: formType) => (dispatch: any) => {
  const request = category => ({
    type: categoryConstants.CATEGORY_CREATE_REQUEST,
    category,
  })

  const success = category => ({
    type: categoryConstants.CATEGORY_CREATE_SUCCESS,
    category,
  })

  const failure = error => ({
    type: categoryConstants.CATEGORY_CREATE_FAILURE,
    error,
  })
  dispatch(request(formData))

  categoryService.create(formData).then(
    category => {
      dispatch(success(category))
      let message = 'Category Created successfully'
      dispatch(alertActions.success(message.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const updateDetail = (formData: formType, categoryId: string) => (
  dispatch: any
) => {
  const request = category => ({
    type: categoryConstants.CATEGORY_UPDATE_REQUEST,
    category,
  })
  const success = category => ({
    type: categoryConstants.CATEGORY_UPDATE_SUCCESS,
    category,
  })
  const failure = error => ({
    type: categoryConstants.CATEGORY_UPDATE_FAILURE,
    error,
  })
  dispatch(request(formData))

  categoryService.updateDetail(formData, categoryId).then(
    category => {
      dispatch(success(category))
      let message = 'Category Updated successfully'
      dispatch(alertActions.success(message.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const listing = () => (dispatch: any) => {
  const request = categories => ({
    type: categoryConstants.CATEGORY_LISTING_REQUEST,
    categories,
  })
  const success = categories => ({
    type: categoryConstants.CATEGORY_LISTING_SUCCESS,
    categories,
  })
  const failure = error => ({
    type: categoryConstants.CATEGORY_LISTING_FAILURE,
    error,
  })
  dispatch(request([]))

  categoryService.listing().then(
    categories => {
      dispatch(success(categories))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const fetchCategoryWithHobby = () => (dispatch: any) => {
  const request = categories => ({
    type: categoryConstants.CATEGORY_LISTING_REQUEST,
    categories,
  })
  const success = categories => ({
    type: categoryConstants.CATEGORY_LISTING_SUCCESS,
    categories,
  })
  const failure = error => ({
    type: categoryConstants.CATEGORY_LISTING_FAILURE,
    error,
  })
  dispatch(request([]))

  categoryService.fetchCategoryWithHobby().then(
    categories => {
      dispatch(success(categories))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const detail = (categoryId: string) => (dispatch: any) => {
  const request = categoryDetail => ({
    type: categoryConstants.CATEGORY_DETAIL_REQUEST,
    categoryDetail,
  })
  const success = categoryDetail => ({
    type: categoryConstants.CATEGORY_DETAIL_SUCCESS,
    categoryDetail,
  })
  const failure = error => ({
    type: categoryConstants.CATEGORY_DETAIL_FAILURE,
    error,
  })
  dispatch(request({}))

  categoryService.detail(categoryId).then(
    response => {
      dispatch(success(response))
    },
    error => {
      dispatch(failure(error.toString()))
      history.push('/category')
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const deleteRecord = (categoryId: string) => (dispatch: any) => {
  const request = categoryDetail => ({
    type: categoryConstants.CATEGORY_DELETE_REQUEST,
    categoryDetail,
  })
  const success = categoryDetail => ({
    type: categoryConstants.CATEGORY_DELETE_SUCCESS,
    categoryDetail,
  })
  const failure = error => ({
    type: categoryConstants.CATEGORY_DELETE_FAILURE,
    error,
  })
  dispatch(request({}))

  categoryService.deleteRecord(categoryId).then(
    (response: any) => {
      dispatch(success(response))
      history.push('/category')
      dispatch(alertActions.success(response.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

export const categoryActions = {
  create,
  listing,
  detail,
  deleteRecord,
  updateDetail,
  fetchCategoryWithHobby,
}
