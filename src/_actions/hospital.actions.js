//@flow
import {hospitalConstants} from '../_constants'
import {hospitalService} from '../_services'
import {alertActions} from './'
import {history} from '../_helpers'

type formType = {
  name: string,
  description: string,
}

const create = (formData: formType) => (dispatch: any) => {
  const request = hospital => ({
    type: hospitalConstants.HOSPITAL_CREATE_REQUEST,
    hospital,
  })

  const success = hospital => ({
    type: hospitalConstants.HOSPITAL_CREATE_SUCCESS,
    hospital,
  })

  const failure = error => ({
    type: hospitalConstants.HOSPITAL_CREATE_FAILURE,
    error,
  })
  dispatch(request(formData))

  hospitalService.create(formData).then(
    hospital => {
      if(hospital.success){
        dispatch(success(hospital))
        let message = 'Hospital Created successfully'
        dispatch(alertActions.success(message.toString()))
      }
      else
      {
        dispatch(failure(hospital.data.message.toString()))
        dispatch(alertActions.error(hospital.data.message.toString()))
      }
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const updateDetail = (formData: formType, hospitalId: string) => (
  dispatch: any
) => {
  const request = hospital => ({
    type: hospitalConstants.HOSPITAL_UPDATE_REQUEST,
    hospital,
  })
  const success = hospital => ({
    type: hospitalConstants.HOSPITAL_UPDATE_SUCCESS,
    hospital,
  })
  const failure = error => ({
    type: hospitalConstants.HOSPITAL_UPDATE_FAILURE,
    error,
  })
  dispatch(request(formData))

  hospitalService.updateDetail(formData, hospitalId).then(
    hospital => {
      if(hospital.status){
        dispatch(success(hospital))
        let message = hospital.message || 'Hospital Updated successfully'
        dispatch(alertActions.success(message.toString()))
      }
      else
      {
        dispatch(failure(hospital.message.toString()))
        dispatch(alertActions.error(hospital.message.toString())) 
      }
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const listing = (formData) => (dispatch: any) => {
  const request = hospitals => ({
    type: hospitalConstants.HOSPITAL_LISTING_REQUEST,
    hospitals,
  })
  const success = hospitals => ({
    type: hospitalConstants.HOSPITAL_LISTING_SUCCESS,
    hospitals,
  })
  const failure = error => ({
    type: hospitalConstants.HOSPITAL_LISTING_FAILURE,
    error,
  })
  dispatch(request([]))

  hospitalService.listing(formData).then(
    hospitals => {
      dispatch(success(hospitals))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const detail = (formData: Object) => (dispatch: any) => {
  const request = hospitalDetail => ({
    type: hospitalConstants.HOSPITAL_DETAIL_REQUEST,
    hospitalDetail,
  })
  const success = hospitalDetail => ({
    type: hospitalConstants.HOSPITAL_DETAIL_SUCCESS,
    hospitalDetail,
  })
  const failure = error => ({
    type: hospitalConstants.HOSPITAL_DETAIL_FAILURE,
    error,
  })
  dispatch(request({}))

  hospitalService.detail(formData).then(
    response => {
      dispatch(success(response))
    },
    error => {
      dispatch(failure(error.toString()))
      history.push('/hospital')
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const deleteRecord = (hospitalId: string) => (dispatch: any) => {
  const request = hospitalDetail => ({
    type: hospitalConstants.HOSPITAL_DELETE_REQUEST,
    hospitalDetail,
  })
  const success = hospitalDetail => ({
    type: hospitalConstants.HOSPITAL_DELETE_SUCCESS,
    hospitalDetail,
  })
  const failure = error => ({
    type: hospitalConstants.HOSPITAL_DELETE_FAILURE,
    error,
  })
  dispatch(request({}))

  hospitalService.deleteRecord(hospitalId).then(
    (response: any) => {
      dispatch(success(response))
      history.push('/hospital')
      dispatch(alertActions.success(response.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

export const hospitalActions = {
  create,
  listing,
  detail,
  deleteRecord,
  updateDetail,
}
