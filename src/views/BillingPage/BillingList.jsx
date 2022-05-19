// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import {invoiceActions} from '../../_actions'
import idx from 'idx'
import { CSVLink } from "react-csv";
import {Button, Row, Col, Form} from 'react-bootstrap'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {auditActions} from '../../_actions'
import dateformat from "dateformat"
import {authDetail} from '../../_helpers'

type Props = {
  getInvoiceDetail: Function,
  alert: any,
  invoiceDetail: Object,
  getAuditFilters: Function,
  auditfilters: Object
}

type State = {
  InvoiceNumber: string,
  invoiceDetail: Object,
  radiologistFilter: Object,
  auditfilters: Object,
  startDate: any,
  endDate: any,
};

const animatedComponents = makeAnimated()

class BillingList extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)
    let newCurrDate = new Date()
    // newCurrDate.setMinutes(newCurrDate.getMinutes() - 30 *24*60)
    this.state = {
      InvoiceNumber:'',
      invoiceDetail: {},
      radiologistFilter: {},
      auditfilters: {},
      startDate: newCurrDate,
      endDate: new Date(),
    }
  }

  componentDidMount() {
    let authData = authDetail()
    let tmpHospitalId = '';
    if(idx(authData, _ => _.detail.user_type) && authData.detail.user_type ==='hospital'){
      tmpHospitalId = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.code : ''
    }
    let filterData = {
      hospital_id: tmpHospitalId
    }
    this.props.getAuditFilters(filterData);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      idx(nextProps, _ => _.invoiceDetail)) {
      let invoiceDetail = nextProps.invoiceDetail[0] || []
      this.setState({
        invoiceDetail: invoiceDetail || []
      })
    }
    if (nextProps.auditfilters && this.state.auditfilters !== nextProps.auditfilters ) {
      this.setState({auditfilters: nextProps.auditfilters})
    }
  }

  optionClicked = (optionsList: any, optionType: string) => {
    this.setState({[optionType]: optionsList})
  }


  handleChange = (e: any) => {
    const {name, value} = e.target
    if(name === 'InvoiceNumber'){
      this.setState({[name]: value})  
    }
    else
    {
      let invoiceDetail = {...this.state.invoiceDetail}
      invoiceDetail[name] = value
      this.setState({invoiceDetail}) 
    }
  }

  handleFilter = (e: any) => {
    e.preventDefault()
    const {InvoiceNumber, radiologistFilter, startDate, endDate } = this.state
    let postData = {type: 'bill', invoice_no: ""};
    if(InvoiceNumber !== ''){
      let invoice_no = (InvoiceNumber.toLowerCase().indexOf('x') === 0) ? InvoiceNumber : 'X'+InvoiceNumber
      postData.invoice_no = invoice_no;
    }
    let tmpRadiologistVal = (radiologistFilter) ? radiologistFilter.value : null;
    if(tmpRadiologistVal){
      postData.name = tmpRadiologistVal;
      postData.fromDate = dateformat(startDate, 'yyyy-mm-dd');
      postData.toDate = dateformat(endDate, 'yyyy-mm-dd');
    }
    this.props.getInvoiceDetail(postData)
  }

  handleClearFilter = (e: any) => {
    e.preventDefault()
    this.setState({InvoiceNumber: '', invoiceDetail: {}})
  }
  handleDateChange = (edate: any, dType) => {
    this.setState({[dType]: edate})
  }
  formatFilterData = (dataType: string) => {
    const {auditfilters} = this.state
    let listData = (auditfilters && auditfilters[dataType]) ? auditfilters[dataType] : []
    let tmpArr = []
    tmpArr = listData.map(ele => ({
        value: ele,
        label: ele,
      }))
    return tmpArr
  }

  render() {
    const {alert} = this.props
    const {InvoiceNumber, invoiceDetail, radiologistFilter, startDate, endDate} = this.state
    let typeLabel = (radiologistFilter && radiologistFilter.value && radiologistFilter.value !=='') ? radiologistFilter.value : 'Radiologist';
    const radiologistList = this.formatFilterData('radiologist')
    let csvData = [
      [
      "InvoiceNumber", 
      "Reference", 
      "ContactName", 
      "EmailAddress", 
      "POAddressLine1", 
      "POAddressLine2", "POAddressLine3", "POAddressLine4", "POCity", "PORegion", "POPostalCode", 
      "POCountry", "InvoiceDate", "DueDate", "Total", "InventoryItemCode", "Description",
      "Quantity", "UnitAmount", "Discount", "AccountCode", "TaxType", "TaxAmount", "TrackingName1",
      "TrackingOption1", "TrackingName2", "TrackingOption2", "Currency", "BrandingTheme"
      ]
    ];
    csvData.push([
      InvoiceNumber, 
      ((invoiceDetail.Reference) ? invoiceDetail.Reference : ''),
      ((invoiceDetail.ContactName) ? invoiceDetail.ContactName : ''),
      ((invoiceDetail.EmailAddress) ? invoiceDetail.EmailAddress : ''),
      ((invoiceDetail.POAddressLine1) ? invoiceDetail.POAddressLine1 : ''),
      ((invoiceDetail.POAddressLine2) ? invoiceDetail.POAddressLine2 : ''),
      ((invoiceDetail.POAddressLine3) ? invoiceDetail.POAddressLine3 : ''),
      ((invoiceDetail.POAddressLine4) ? invoiceDetail.POAddressLine4 : ''),
      ((invoiceDetail.POCity) ? invoiceDetail.POCity : ''),
      ((invoiceDetail.PORegion) ? invoiceDetail.PORegion : ''),
      ((invoiceDetail.POPostalCode) ? invoiceDetail.POPostalCode : ''),
      ((invoiceDetail.POCountry) ? invoiceDetail.POCountry : ''),
      ((invoiceDetail.InvoiceDate) ? dateformat(invoiceDetail.InvoiceDate, 'dd-mm-yyyy') : ''),
      ((invoiceDetail.DueDate) ? dateformat(invoiceDetail.DueDate, 'dd-mm-yyyy') : ''),
      ((invoiceDetail.Total) ? invoiceDetail.Total : ''),
      ((invoiceDetail.InventoryItemCode) ? invoiceDetail.InventoryItemCode : ''),
      ((invoiceDetail.Description) ? invoiceDetail.Description : ''),
      ((invoiceDetail.Quantity) ? invoiceDetail.Quantity : ''),
      ((invoiceDetail.UnitAmount) ? invoiceDetail.UnitAmount : ''),
      ((invoiceDetail.Discount) ? invoiceDetail.Discount : ''),
      ((invoiceDetail.AccountCode) ? invoiceDetail.AccountCode : ''),
      ((invoiceDetail.TaxType) ? invoiceDetail.TaxType : ''),
      ((invoiceDetail.TaxAmount) ? invoiceDetail.TaxAmount : ''),
      ((invoiceDetail.TrackingName1) ? invoiceDetail.TrackingName1 : ''),
      ((invoiceDetail.TrackingOption1) ? invoiceDetail.TrackingOption1 : ''),
      ((invoiceDetail.TrackingName2) ? invoiceDetail.TrackingName2 : ''),
      ((invoiceDetail.TrackingOption2) ? invoiceDetail.TrackingOption2 : ''),
      ((invoiceDetail.Currency) ? invoiceDetail.Currency : ''),
      ((invoiceDetail.BrandingTheme) ? invoiceDetail.BrandingTheme : '')
    ])

    return (
      <div className="content-wrapper">
        {alert && alert.message && (
          <div className={`alert ${alert.type}`}>{alert.message}</div>
        )}
        <div className="card">
          <div className="card-body">
            <Row >
              <Col lg={2} md={2} sm={12}>
                <Form.Group>
                  <Form.Label>Radiologist</Form.Label>
                  <Select
                    name="radiologistFilter"
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    value={radiologistFilter}
                    onChange={e => this.optionClicked(e, 'radiologistFilter')}
                    // isMulti
                    options={radiologistList}
                  />
                </Form.Group>
              </Col>
              <Col lg={4} md={4} sm={12}>
                <Form.Group>
                  <Form.Label >Date Range</Form.Label>
                  <span className="daterow">
                  <DatePicker
                    className="form-control"
                    name= 'startDate'
                    selected={startDate}
                    maxDate={new Date()}
                    dateFormat="dd-MM-yyyy"
                    onChange={e => this.handleDateChange(e, 'startDate')}
                  /> -  
                  <DatePicker
                    className="form-control"
                    name= 'endDate'
                    selected={endDate}
                    dateFormat="dd-MM-yyyy"
                    minDate={startDate}
                    onChange={e => this.handleDateChange(e, 'endDate')}
                  />
                  </span>
                </Form.Group>
              </Col>
              <Col lg={2} md={2} sm={12}>
                <Form.Group>
                <Form.Label >&nbsp;</Form.Label>
                <Button className="form-control" onClick={e => this.handleFilter(e)}>Filter</Button>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-10">
                    <div className="d-sm-flex align-items-baseline report-summary-header" style={{'borderBottom': '0px'}}>
                      <h5 className="font-weight-semibold">Billing Invoice</h5>
                    </div>
                  </div>
                  <div class="col-md-2">{invoiceDetail.InvoiceNumber && (<CSVLink data={csvData} filename={"billing-invoice-report.csv"} className="csvlink" target="_blank">Export To CSV <i className="icon-layers menu-icon"></i></CSVLink>)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Form name="form">
          <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">  
                  <div className="d-sm-flex align-items-center mb-4"><h5 className="card-title mb-sm-12" style={{'margin':'auto'}}>{typeLabel}</h5> </div>
                    <div className="row">
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Invoice Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="InvoiceNumber"
                            value={InvoiceNumber}
                            onChange={e => this.handleChange(e)}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-2">
                        <Form.Group>
                          <Form.Label>&nbsp;</Form.Label>
                          <div type="button" style={{'marginTop': '22px'}} className="btn btn-primary" onClick={e => this.handleFilter(e)}>
                            <i className="icon-magnifier menu-icon"></i>
                          </div> &nbsp;
                          <div type="button" style={{'marginTop': '22px'}} className="btn btn-primary" onClick={e => this.handleClearFilter(e)}>
                            <i className="icon-refresh menu-icon"></i>
                          </div>
                        </Form.Group>
                      </div>
                      {/*<div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Reference</Form.Label>
                          <Form.Control
                            type="text"
                            name="Reference"
                            value={(invoiceDetail.Reference) ? invoiceDetail.Reference : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>*/}
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Invoice Date</Form.Label>
                          <Form.Control
                            type="text"
                            name="InvoiceDate"
                            value={(invoiceDetail.InvoiceDate) ? dateformat(invoiceDetail.InvoiceDate, 'dd-mm-yyyy') : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Due Date</Form.Label>
                          <Form.Control
                            type="text"
                            name="DueDate"
                            value={(invoiceDetail.DueDate) ? dateformat(invoiceDetail.DueDate, 'dd-mm-yyyy') : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Contact Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="ContactName"
                            value={(invoiceDetail.ContactName) ? invoiceDetail.ContactName : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="text"
                            name="EmailAddress"
                            value={(invoiceDetail.EmailAddress) ? invoiceDetail.EmailAddress : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Reference</Form.Label>
                          <Form.Control
                            type="text"
                            name="Reference"
                            value={(invoiceDetail.Reference) ? invoiceDetail.Reference : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Address Line 1</Form.Label>
                          <Form.Control
                            type="text"
                            name="POAddressLine1"
                            value={(invoiceDetail.POAddressLine1) ? invoiceDetail.POAddressLine1 : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Address Line 2</Form.Label>
                          <Form.Control
                            type="text"
                            name="POAddressLine2"
                            value={(invoiceDetail.POAddressLine2) ? invoiceDetail.POAddressLine2 : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Address Line 3</Form.Label>
                          <Form.Control
                            type="text"
                            name="POAddressLine3"
                            value={(invoiceDetail.POAddressLine3) ? invoiceDetail.POAddressLine3 : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Address Line 4</Form.Label>
                          <Form.Control
                            type="text"
                            name="POAddressLine4"
                            value={(invoiceDetail.POAddressLine4) ? invoiceDetail.POAddressLine4 : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            type="text"
                            name="POCountry"
                            value={(invoiceDetail.POCountry) ? invoiceDetail.POCountry : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Region</Form.Label>
                          <Form.Control
                            type="text"
                            name="PORegion"
                            value={(invoiceDetail.PORegion) ? invoiceDetail.PORegion : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="POCity"
                            value={(invoiceDetail.POCity) ? invoiceDetail.POCity : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="POPostalCode"
                            value={(invoiceDetail.POPostalCode) ? invoiceDetail.POPostalCode : ''}
                            readOnly={true}
                          />
                        </Form.Group>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">  
                  <div className="row">
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>Account Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="AccountCode"
                          value={(invoiceDetail.AccountCode) ? invoiceDetail.AccountCode : ''}
                          readOnly={true}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          name="Description"
                          value={(invoiceDetail.Description) ? invoiceDetail.Description : ''}
                          onChange={e => this.handleChange(e)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                          type="text"
                          name="Quantity"
                          value={(invoiceDetail.Quantity) ? invoiceDetail.Quantity : ''}
                          onChange={e => this.handleChange(e)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>Unit Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="UnitAmount"
                          value={(invoiceDetail.UnitAmount) ? invoiceDetail.UnitAmount : ''}
                          onChange={e => this.handleChange(e)}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>Tracking Name 1</Form.Label>
                        <Form.Control
                          type="text"
                          name="TrackingName1"
                          value={(invoiceDetail.TrackingName1) ? invoiceDetail.TrackingName1 : ''}
                          onChange={e => this.handleChange(e)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>Tracking Option 1</Form.Label>
                        <Form.Control
                          type="text"
                          name="TrackingOption1"
                          value={(invoiceDetail.TrackingOption1) ? invoiceDetail.TrackingOption1 : ''}
                          onChange={e => this.handleChange(e)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label>Tracking Name 2</Form.Label>
                        <Form.Control
                          type="text"
                          name="TrackingName2"
                          value={(invoiceDetail.TrackingName2) ? invoiceDetail.TrackingName2 : ''}
                          onChange={e => this.handleChange(e)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label>Tracking Option 2</Form.Label>
                        <Form.Control
                          type="text"
                          name="TrackingOption2"
                          value={(invoiceDetail.TrackingOption2) ? invoiceDetail.TrackingOption2 : ''}
                          onChange={e => this.handleChange(e)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label>Branding Theme</Form.Label>
                        <Form.Control
                          type="text"
                          name="BrandingTheme"
                          value={(invoiceDetail.BrandingTheme) ? invoiceDetail.BrandingTheme : ''}
                          onChange={e => this.handleChange(e)}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">  
                  <div className="row">
                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label>Item Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="InventoryItemCode"
                          value={(invoiceDetail.InventoryItemCode) ? invoiceDetail.InventoryItemCode : ''}
                          readOnly={true}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label>Currency</Form.Label>
                        <Form.Control
                          type="text"
                          name="Currency"
                          value={(invoiceDetail.Currency) ? invoiceDetail.Currency : ''}
                          onChange={e => this.handleChange(e)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label>Discount</Form.Label>
                        <Form.Control
                          type="text"
                          name="Discount"
                          value={(invoiceDetail.Discount) ? invoiceDetail.Discount : ''}
                          onChange={e => this.handleChange(e)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>Tax Type</Form.Label>
                        <Form.Control
                          type="text"
                          name="TaxType"
                          value={(invoiceDetail.TaxType) ? invoiceDetail.TaxType : ''}
                          readOnly={true}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>Tax Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="TaxAmount"
                          value={(invoiceDetail.TaxAmount) ? invoiceDetail.TaxAmount : ''}
                          readOnly={true}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = state => {
return {
  invoiceDetail: state.invoice.detail || [],
  alert: state.alert || false,
  auditfilters: state.audit.auditfilters || {}
}}

const mapDispatchToProps = dispatch => ({
  getInvoiceDetail: (formData: Object) => {
    dispatch(invoiceActions.getInvoiceDetail(formData))
  },
  getAuditFilters: (filterData: Object) => {
    dispatch(auditActions.getAuditFilters(filterData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BillingList)