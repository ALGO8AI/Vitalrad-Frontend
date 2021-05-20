//@flow
import {invoiceConstants} from '../_constants'
import {invoiceService} from '../_services'
import {alertActions} from './'

const getInvoiceDetail = (formData: Object) => (dispatch: any) => {
  const request = invoice => ({
    type: invoiceConstants.INVOICE_INFO_REQUEST,
    invoice,
  })
  const success = invoice => ({
    type: invoiceConstants.INVOICE_INFO_SUCCESS,
    invoice,
  })
  const failure = error => ({
    type: invoiceConstants.INVOICE_INFO_FAILURE,
    error,
  })
  dispatch(request([]))

  invoiceService.getInvoiceDetail(formData).then(
    invoice => {
      if(invoice.status && invoice.detail.length ===0){
        dispatch(alertActions.error(invoice.message.toString()))
      }
      else if(invoice.status && invoice.detail && invoice.detail.length > 0){
        dispatch(success(invoice))
      }
      else{
        let err = (invoice.data) ? invoice.data[0].message : 'Invalid input';
        dispatch(failure(err.toString()))
        dispatch(alertActions.error(err.toString()))
      }
    },
    error => {
      dispatch(failure(error.toString()))
      dispatch(alertActions.error(error.toString()))
    }
  )
}

export const invoiceActions = {
  getInvoiceDetail,
}
