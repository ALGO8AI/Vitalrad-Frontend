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

export const discrepancyActions = {
  listing,
}
