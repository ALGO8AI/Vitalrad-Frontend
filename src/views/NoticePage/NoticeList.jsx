// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import idx from 'idx'
import {discrepancyActions} from '../../_actions'
import Moment from 'react-moment'
import ReactTooltip from 'react-tooltip'
import {Pagination} from '../../components/common';
import {authDetail, loggedInUser} from '../../_helpers'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

type Props = {
  getDiscrepancy: Function,
  discrepancies: Array<any>,
}

type State = {
  discrepancyList: Array<any>,
  accessionNo: any,
  currentPage: number,
  totalPages: number,
  pageLimit: number,
  loggedInUser:string,
  allChecked: boolean
};

class NoticeList extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)

    this.state = {
      showChat: false,
      discrepancyList: [],
      accessionNo: '',
      totalPages: 0,
      pageLimit: 10,
      currentPage: 1,
      allChecked: false,
      loggedInUser: loggedInUser()
    }
  }
  componentDidMount = () => {
    this.getDiscrepancyList()
  }
  
  manageUserFilter =() => {
    let authData = authDetail()
    let formData = {}
    switch(this.state.loggedInUser) {
      case 'hospital':
        if(idx(authData, _ => _.detail.user_type)){
          let hospitalName = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : 'Hospital 7'
          formData.hospital_name = hospitalName
        }
        
        break;
      case 'radiologist':
        if(idx(authData, _ => _.detail.user_type)){
          let radiologistId = (idx(authData, _ => _.detail.profile.code)) ? authData.detail.profile.code : '1001'
          formData.radiologist_id = radiologistId
        }
        break;
      case 'doctor':
        if(idx(authData, _ => _.detail.user_type)){
          let doctorId = (idx(authData, _ => _.detail.profile.code)) ? authData.detail.profile.code : '1001'
          formData.doctor_id = doctorId
        }
        break;
      default:
        break; 
    }
    return formData;
  }

  getDiscrepancyList = () => {
    const {currentPage, pageLimit} = this.state
    let formData = {
      offset: currentPage * pageLimit,
      limit: pageLimit
    }
    let userFilter = this.manageUserFilter()
    let postData = {...formData, ...userFilter}
    this.props.getDiscrepancy(postData)
  }

  UNSAFE_componentWillReceiveProps = (nextProps: any) => {
    if (nextProps.discrepancies) {
      this.setState({discrepancyList: nextProps.discrepancies})
    }
  }

  onPageChanged = data => {
    const { currentPage } = data;
    const {pageLimit} = this.state
    const offset = (currentPage) * pageLimit;
    
    let formData = {
      offset: offset,
      limit: pageLimit
    }
    let userFilter = this.manageUserFilter()
    let postData = {...formData, ...userFilter}
    this.props.getDiscrepancy(postData)
    

  }

  handleAllCheck =() => this.setState({allChecked: !this.state.allChecked})

  handleCheck =(e) => {
    console.log('e', e)
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => alert('Click Yes')
        },
        {
          label: 'No',
          onClick: () => alert('Click No')
        }
      ],
      closeOnEscape: false,
      closeOnClickOutside: false,
    });
  }

  render() {
    const {pageLimit} = this.state
    const {match} = this.props
    let discrepancyList = idx(this.state, _ => _.discrepancyList)
      ? this.state.discrepancyList
      : []
    let disRow = null
    let totalDiscrepancy = (discrepancyList.length > 0) ? discrepancyList[0].totalcount : 0
    disRow = discrepancyList.map((dis, index) => (
      <tr key={index}>
        <td>{dis.Reported === 'Reported' ? 'Acknowleged' : 'Action & Acknowlege'}</td>
        <td><Moment format="Do MMMM YYYY">{dis.Scan_Received_Date}</Moment></td>
        <td>{dis.Reported_By}</td>
        <td>{dis.Patient_First_Name} {dis.Surname}</td>
        <td data-tip type="light" data-for={'tip-'+dis.Accession_No}>{dis.Accession_No}
        <ReactTooltip  type="light" className="grey-border" id={'tip-'+dis.Accession_No} aria-haspopup='true' role='example'>
          <table>
            <tbody>
              <tr><td className="tip-label">Accession No :</td><td className="tip-value">{dis.Accession_No}</td></tr>
              <tr><td className="tip-label">Discrepancy Raised by : </td><td className="tip-value">{dis.Reported_By}</td></tr>
              <tr><td className="tip-label">Discrepancy : </td><td className="tip-value">Appears to have used in ACC slice 354-{359 + index + 1}</td></tr>
              <tr><td className="tip-label">Date : </td><td className="tip-value">{dis.Scan_Received_Date}</td></tr>
            </tbody>
          </table>
          <br />
          <h2 className="tip-value">Discrepancy Report</h2>
          <table>
            <tbody>
              <tr className="tip-label"><td>Patients Name : {dis.Patient_First_Name} {dis.Surname}</td><td>Hospital Name : {dis.Hospital_Name}</td><td>Hospital Number : {dis.Hospital_Number}</td></tr>
              <tr className="tip-label"><td>Scan Received Date : {dis.Scan_Received_Date}</td><td>Scan Received Time : {dis.Scan_Received_time}</td><td>Modality : {dis.Modality}</td></tr>
              <tr className="tip-label"><td>Body Part : {dis.Body_Part}</td><td>Tat Status : {dis.TAT_Status}</td><td></td></tr>
              <tr className="tip-label"><td>Audit Person : {dis.Audit_Person}</td><td>Audit Category : {dis.Audit_Category}</td><td></td></tr>
            </tbody>
          </table>
        </ReactTooltip>
        </td>
        <td>
          <input type="checkbox" onChange={this.handleCheck} defaultChecked={this.state.allChecked}/>
        </td>
      </tr>
    ))
    return (
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                {match && match.path !== '/publicdiscrepancy' && (<div className="d-sm-flex align-items-center mb-4">
                  <h4 className="card-title mb-sm-0">Notices Dashboard</h4>
                </div>)}
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="font-weight-bold">Action Required</th>
                        <th className="font-weight-bold">Scan Received Date</th>
                        <th className="font-weight-bold">Sent By</th>
                        <th className="font-weight-bold">Patient</th>
                        <th className="font-weight-bold">Accession No.</th>
                        <th className="font-weight-bold">Acknowlege Record {/*<input type="checkbox" onChange={this.handleAllCheck} defaultChecked={this.state.allChecked}/>*/}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {disRow}
                    </tbody>
                  </table>
                </div>
                {(totalDiscrepancy > 0) && (<Pagination 
                  totalRecords={totalDiscrepancy} 
                  pageLimit={pageLimit} 
                  pageNeighbours={1} 
                  onPageChanged={this.onPageChanged} 
                />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  discrepancies: state.discrepancy.detail || [],
})

const mapDispatchToProps = dispatch => ({
  getDiscrepancy: (formData: Object) => {
    dispatch(discrepancyActions.listing(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoticeList)