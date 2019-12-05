//@flow
import {doctorConstants} from '../_constants'
import {doctorService} from '../_services'
import {alertActions} from './'
import {history} from '../_helpers'

type formType = {
  name: string,
  description: string,
}

const create = (formData: formType) => (dispatch: any) => {
  const request = doctor => ({type: doctorConstants.DOCTOR_CREATE_REQUEST, doctor})
  const success = doctor => ({type: doctorConstants.DOCTOR_CREATE_SUCCESS, doctor})
  const failure = error => ({type: doctorConstants.DOCTOR_CREATE_FAILURE, error})

  dispatch(request(formData))

  doctorService.create(formData).then(
    doctor => {
      dispatch(success(doctor))
      let message = 'Doctor Created successfully'
      dispatch(alertActions.success(message.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const updateDetail = (formData: formType, doctorId: string) => (
  dispatch: any
) => {
  const request = doctor => ({type: doctorConstants.DOCTOR_UPDATE_REQUEST, doctor})
  const success = doctor => ({type: doctorConstants.DOCTOR_UPDATE_SUCCESS, doctor})
  const failure = error => ({type: doctorConstants.DOCTOR_UPDATE_FAILURE, error})

  dispatch(request(formData))

  doctorService.updateDetail(formData, doctorId).then(
    doctor => {
      dispatch(success(doctor))
      let message = 'Doctor Updated successfully'
      dispatch(alertActions.success(message.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const listing = () => (dispatch: any) => {
  const request = doctors => ({
    type: doctorConstants.DOCTOR_LISTING_REQUEST,
    doctors,
  })
  const success = doctors => ({
    type: doctorConstants.DOCTOR_LISTING_SUCCESS,
    doctors,
  })
  const failure = error => ({type: doctorConstants.DOCTOR_LISTING_FAILURE, error})
  dispatch(request([]))

  doctorService.listing().then(
    doctors => {
      dispatch(success(doctors))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const detail = (doctorId: string) => (dispatch: any) => {
  const request = doctorDetail => ({
    type: doctorConstants.DOCTOR_DETAIL_REQUEST,
    doctorDetail,
  })
  const success = doctorDetail => ({
    type: doctorConstants.DOCTOR_DETAIL_SUCCESS,
    doctorDetail,
  })
  const failure = error => ({type: doctorConstants.DOCTOR_DETAIL_FAILURE, error})
  dispatch(request({}))

  doctorService.detail(doctorId).then(
    response => {
      dispatch(success(response))
    },
    error => {
      dispatch(failure(error.toString()))
      history.push('/doctor/')
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const deleteRecord = (doctorId: string) => (dispatch: any) => {
  const request = doctorDetail => ({
    type: doctorConstants.DOCTOR_DELETE_REQUEST,
    doctorDetail,
  })
  const success = doctorDetail => ({
    type: doctorConstants.DOCTOR_DELETE_SUCCESS,
    doctorDetail,
  })
  const failure = error => ({type: doctorConstants.DOCTOR_DELETE_FAILURE, error})
  dispatch(request({}))

  doctorService.deleteRecord(doctorId).then(
    (response: any) => {
      dispatch(success(response))
      history.push('/doctor')
      dispatch(alertActions.success(response.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      history.push('/doctor')
      dispatch(alertActions.error(error.toString()))
    }
  )
}

export const doctorActions = {
  create,
  listing,
  detail,
  deleteRecord,
  updateDetail,
}
