//@flow
import {radiologistConstants} from '../_constants'
import {radiologistService} from '../_services'
import {alertActions} from './'
import {history} from '../_helpers'

type formType = {
  name: string,
  description: string,
}

const create = (formData: formType) => (dispatch: any) => {
  const request = radiologist => ({
    type: radiologistConstants.RADIO_CREATE_REQUEST,
    radiologist,
  })

  const success = radiologist => ({
    type: radiologistConstants.RADIO_CREATE_SUCCESS,
    radiologist,
  })

  const failure = error => ({
    type: radiologistConstants.RADIO_CREATE_FAILURE,
    error,
  })
  dispatch(request(formData))

  radiologistService.create(formData).then(
    radiologist => {
      if(radiologist.success){
        dispatch(success(radiologist))
        let message = 'Radiologist Created successfully'
        dispatch(alertActions.success(message.toString()))
      }
      else
      {
        dispatch(failure(radiologist.data.message.toString()))
        dispatch(alertActions.error(radiologist.data.message.toString())) 
      }
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const updateDetail = (formData: formType, radiologistId: string) => (
  dispatch: any
) => {
  const request = radiologist => ({
    type: radiologistConstants.RADIO_UPDATE_REQUEST,
    radiologist,
  })
  const success = radiologist => ({
    type: radiologistConstants.RADIO_UPDATE_SUCCESS,
    radiologist,
  })
  const failure = error => ({
    type: radiologistConstants.RADIO_UPDATE_FAILURE,
    error,
  })
  dispatch(request(formData))

  radiologistService.updateDetail(formData, radiologistId).then(
    radiologist => {
      if(radiologist.status){
        dispatch(success(radiologist))
        let message = 'Radiologist Updated successfully'
        dispatch(alertActions.success(message.toString()))
      }
      else
      {
        dispatch(failure(radiologist.message.toString()))
        dispatch(alertActions.error(radiologist.message.toString())) 
      }
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const listing = (formData) => (dispatch: any) => {
  const request = radiologists => ({
    type: radiologistConstants.RADIO_LISTING_REQUEST,
    radiologists,
  })
  const success = radiologists => ({
    type: radiologistConstants.RADIO_LISTING_SUCCESS,
    radiologists,
  })
  const failure = error => ({
    type: radiologistConstants.RADIO_LISTING_FAILURE,
    error,
  })
  dispatch(request([]))

  radiologistService.listing(formData).then(
    radiologists => {
      dispatch(success(radiologists))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const detail = (formData: Object) => (dispatch: any) => {
  const request = radiologistDetail => ({
    type: radiologistConstants.RADIO_DETAIL_REQUEST,
    radiologistDetail,
  })
  const success = radiologistDetail => ({
    type: radiologistConstants.RADIO_DETAIL_SUCCESS,
    radiologistDetail,
  })
  const failure = error => ({
    type: radiologistConstants.RADIO_DETAIL_FAILURE,
    error,
  })
  dispatch(request({}))

  radiologistService.detail(formData).then(
    response => {
      dispatch(success(response))
    },
    error => {
      dispatch(failure(error.toString()))
      history.push('/radiologist')
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const deleteRecord = (radiologistId: string) => (dispatch: any) => {
  const request = radiologistDetail => ({
    type: radiologistConstants.RADIO_DELETE_REQUEST,
    radiologistDetail,
  })
  const success = radiologistDetail => ({
    type: radiologistConstants.RADIO_DELETE_SUCCESS,
    radiologistDetail,
  })
  const failure = error => ({
    type: radiologistConstants.RADIO_DELETE_FAILURE,
    error,
  })
  dispatch(request({}))

  radiologistService.deleteRecord(radiologistId).then(
    (response: any) => {
      dispatch(success(response))
      history.push('/radiologist')
      dispatch(alertActions.success(response.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

export const radiologistActions = {
  create,
  listing,
  detail,
  deleteRecord,
  updateDetail,
}
