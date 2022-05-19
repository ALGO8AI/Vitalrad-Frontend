//@flow
import {discrepancyConstants} from '../_constants'
import {discrepancyService} from '../_services'
import {alertActions} from './'

const listing = (formData: Object) => (dispatch: any) => {
  const request = discrepancies => ({
    type: discrepancyConstants.DIS_LISTING_REQUEST,
    discrepancies,
  })
  const success = discrepancies => ({
    type: discrepancyConstants.DIS_LISTING_SUCCESS,
    discrepancies,
  })
  const failure = error => ({
    type: discrepancyConstants.DIS_LISTING_FAILURE,
    error,
  })
  dispatch(request([]))

  discrepancyService.listing(formData).then(
    discrepancies => {
      dispatch(success(discrepancies))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const getAccessionDetail = (formData: Object) => (dispatch: any) => {
  const request = accessioninfo => ({
    type: discrepancyConstants.ACCESSION_INFO_REQUEST,
    accessioninfo,
  })
  const success = accessioninfo => ({
    type: discrepancyConstants.ACCESSION_INFO_SUCCESS,
    accessioninfo,
  })
  const failure = error => ({
    type: discrepancyConstants.ACCESSION_INFO_FAILURE,
    error,
  })
  dispatch(request([]))

  discrepancyService.getAccessionDetail(formData).then(
    accessioninfo => {
      dispatch(success(accessioninfo))
      // console.log('accessioninfo', accessioninfo)
      // if(!accessioninfo.status){
      //   let emsg = accessioninfo.message || 'Record Not Found / Discrepancy already Raised / Not Authorized for this number!'
      //   dispatch(alertActions.error(emsg))
      // }
      if((accessioninfo.detail && accessioninfo.detail.length===0) || !accessioninfo.status){
        let emsg = accessioninfo.message || 'Record Not Found / Discrepancy already Raised / Not Authorized for this number!'
        dispatch(alertActions.error(emsg))
      }
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const createDiscrepancy = (formData: Object) => (dispatch: any) => {
  const request = accessioninfo => ({
    type: discrepancyConstants.Add_DISCREPANCY_REQUEST,
    accessioninfo,
  })
  const success = accessioninfo => ({
    type: discrepancyConstants.Add_DISCREPANCY_SUCCESS,
    accessioninfo,
  })
  const failure = error => ({
    type: discrepancyConstants.Add_DISCREPANCY_FAILURE,
    error,
  })
  dispatch(request([]))

  discrepancyService.createDiscrepancy(formData).then(
    accessioninfo => {
      if(accessioninfo.status){
        dispatch(success(accessioninfo))
      }
      let msg = accessioninfo.message || ''
      dispatch(alertActions.success(msg.toString()))
      
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const updateDiscrepencyStatus = (formData: Object) => (dispatch: any) => {
  const request = accessioninfo => ({
    type: discrepancyConstants.UPDATE_DISCREPANCY_REQUEST,
    accessioninfo,
  })
  const success = accessioninfo => ({
    type: discrepancyConstants.UPDATE_DISCREPANCY_SUCCESS,
    accessioninfo,
  })
  const failure = error => ({
    type: discrepancyConstants.UPDATE_DISCREPANCY_FAILURE,
    error,
  })
  dispatch(request([]))

  discrepancyService.updateDiscrepencyStatus(formData).then(
    accessioninfo => {
      if(accessioninfo.status){
        dispatch(success(accessioninfo))
      }
      let msg = accessioninfo.message || ''
      dispatch(alertActions.success(msg.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const updateFeedback = (formData: Object) => (dispatch: any) => {
  const request = accessioninfo => ({
    type: discrepancyConstants.UPDATE_FEEDBACK_REQUEST,
    accessioninfo,
  })
  const success = accessioninfo => ({
    type: discrepancyConstants.UPDATE_FEEDBACK_SUCCESS,
    accessioninfo,
  })
  const failure = error => ({
    type: discrepancyConstants.UPDATE_FEEDBACK_FAILURE,
    error,
  })
  dispatch(request([]))

  discrepancyService.updateFeedback(formData).then(
    accessioninfo => {
      if(accessioninfo.status){
        dispatch(success(accessioninfo))
      }
      let msg = accessioninfo.message || ''
      dispatch(alertActions.success(msg.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const getNotifications = (formData: Object) => (dispatch: any) => {
  const request = discrepancies => ({
    type: discrepancyConstants.NOTIFY_LISTING_REQUEST,
    discrepancies,
  })
  const success = discrepancies => ({
    type: discrepancyConstants.NOTIFY_LISTING_SUCCESS,
    discrepancies,
  })
  const failure = error => ({
    type: discrepancyConstants.NOTIFY_LISTING_FAILURE,
    error,
  })
  dispatch(request([]))

  discrepancyService.getNotifications(formData).then(
    discrepancies => {
      dispatch(success(discrepancies))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const updateNotifications = (formData: Object) => (dispatch: any) => {
  const request = discrepancies => ({
    type: discrepancyConstants.NOTIFY_UPDATE_REQUEST,
    discrepancies,
  })
  const success = discrepancies => ({
    type: discrepancyConstants.NOTIFY_UPDATE_SUCCESS,
    discrepancies,
  })
  const failure = error => ({
    type: discrepancyConstants.NOTIFY_UPDATE_FAILURE,
    error,
  })
  dispatch(request([]))

  discrepancyService.updateNotifications(formData).then(
    discrepancies => {
      dispatch(success(discrepancies))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

const discrepencyFinalReview = (formData: Object) => (dispatch: any) => {
  const request = accessioninfo => ({
    type: discrepancyConstants.UPDATE_DISCREPANCY_REQUEST,
    accessioninfo,
  })
  const success = accessioninfo => ({
    type: discrepancyConstants.UPDATE_DISCREPANCY_SUCCESS,
    accessioninfo,
  })
  const failure = error => ({
    type: discrepancyConstants.UPDATE_DISCREPANCY_FAILURE,
    error,
  })
  dispatch(request([]))

  discrepancyService.discrepencyFinalReview(formData).then(
    accessioninfo => {
      if(accessioninfo.status){
        dispatch(success(accessioninfo))
      }
      let msg = accessioninfo.message || ''
      dispatch(alertActions.success(msg.toString()))
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

export const discrepancyActions = {
  listing,
  getAccessionDetail,
  createDiscrepancy,
  updateDiscrepencyStatus,
  updateFeedback,
  getNotifications,
  updateNotifications,
  discrepencyFinalReview
}
