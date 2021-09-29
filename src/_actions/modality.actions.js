//@flow
import {  modalityConstants} from '../_constants'
import {modalityService} from '../_services'
import {alertActions} from './'
import {history} from '../_helpers'

type formType = {
}

const create = (formData: formType) => (dispatch: any) => {
  const request = modality => ({
    type:   modalityConstants.MODALITY_CREATE_REQUEST,
    modality,
  })

  const success = modality => ({
    type:   modalityConstants.MODALITY_CREATE_SUCCESS,
    modality,
  })

  const failure = error => ({
    type:   modalityConstants.MODALITY_CREATE_FAILURE,
    error,
  })
  dispatch(request(formData))

  modalityService.create(formData).then(
    modality => {
      if(modality.status){
        dispatch(success(modality))
        let message = 'Record Created successfully'
        dispatch(alertActions.success(message.toString()))
      }
      else
      {
        dispatch(failure(modality.message.toString()))
        dispatch(alertActions.error(modality.message.toString()))
      }
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const updateDetail = (formData: formType, modalityId: string) => (
  dispatch: any
) => {
  const request = modality => ({
    type:   modalityConstants.MODALITY_UPDATE_REQUEST,
    modality,
  })
  const success = modality => ({
    type:   modalityConstants.MODALITY_UPDATE_SUCCESS,
    modality,
  })
  const failure = error => ({
    type:   modalityConstants.MODALITY_UPDATE_FAILURE,
    error,
  })
  dispatch(request(formData))

  modalityService.updateDetail(formData, modalityId).then(
    modality => {
      if(modality.status){
        dispatch(success(modality))
        let message = modality.message || 'Record Updated successfully'
        dispatch(alertActions.success(message.toString()))
      }
      else
      {
        dispatch(failure(modality.message.toString()))
        dispatch(alertActions.error(modality.message.toString())) 
      }
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const getModalities = (formData) => (dispatch: any) => {
  const request = modalitys => ({
    type:   modalityConstants.MODALITY_LISTING_REQUEST,
    modalitys,
  })
  const success = modalitys => ({
    type:   modalityConstants.MODALITY_LISTING_SUCCESS,
    modalitys,
  })
  const failure = error => ({
    type:   modalityConstants.MODALITY_LISTING_FAILURE,
    error,
  })
  dispatch(request([]))

  modalityService.getModalities(formData).then(
    modalitys => {
      dispatch(success(modalitys))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const detail = (formData: Object) => (dispatch: any) => {
  const request = modalityDetail => ({
    type:   modalityConstants.MODALITY_DETAIL_REQUEST,
    modalityDetail,
  })
  const success = modalityDetail => ({
    type:   modalityConstants.MODALITY_DETAIL_SUCCESS,
    modalityDetail,
  })
  const failure = error => ({
    type:   modalityConstants.MODALITY_DETAIL_FAILURE,
    error,
  })
  dispatch(request({}))

  modalityService.detail(formData).then(
    response => {
      dispatch(success(response))
    },
    error => {
      dispatch(failure(error.toString()))
      history.push('/modality')
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const deleteRecord = (formData: Object) => (dispatch: any) => {
  const request = modalityDetail => ({
    type:   modalityConstants.MODALITY_DELETE_REQUEST,
    modalityDetail,
  })
  const success = modalityDetail => ({
    type:   modalityConstants.MODALITY_DELETE_SUCCESS,
    modalityDetail,
  })
  const failure = error => ({
    type:   modalityConstants.MODALITY_DELETE_FAILURE,
    error,
  })
  dispatch(request({}))

  modalityService.deleteRecord(formData).then(
    (response: any) => {
      dispatch(success(response))
      history.push('/modality')
      dispatch(alertActions.success(response.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

export const modalityActions = {
  create,
  getModalities,
  detail,
  deleteRecord,
  updateDetail,
}
