// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import idx from 'idx'
import {Button, Form} from 'react-bootstrap'
import {Icon} from 'react-icons-kit'
import {filter} from 'react-icons-kit/fa'
import {discrepancyActions} from '../../_actions'
import Moment from 'react-moment'
import ReactTooltip from 'react-tooltip'
import {Pagination} from '../../components/common';
import {authDetail, loggedInUser} from '../../_helpers'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {auditActions} from '../../_actions'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

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
  allChecked: boolean,
  pageFilterLimit: Object,
  accession_no: string
};
const animatedComponents = makeAnimated()
class NoticeList extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)

    this.state = {
      discrepancyList: [],
      accessionNo: '',
      totalPages: 0,
      pageLimit: 15,
      currentPage: 1,
      allChecked: false,
      loggedInUser: loggedInUser(),
      pageFilterLimit: {value: 15, label: 15},
      accession_no: ''
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

  getDiscrepancyList = (pageLimitOpt = 0) => {
    const {pageLimit} = this.state
    let formData = {
      offset: 0, //currentPage * pageLimit,
      limit: (pageLimitOpt > 0) ? pageLimitOpt : pageLimit,
      type: 'notices'
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
    if(data.currentPage !== this.state.currentPage){
      this.setState({currentPage: currentPage })
      const {pageLimit} = this.state
      const offset = (currentPage -1 ) * pageLimit;
      
      let formData = {
        offset: offset,
        limit: pageLimit,
        type: 'notices'
      }
      let userFilter = this.manageUserFilter()
      let postData = {...formData, ...userFilter}
      this.props.getDiscrepancy(postData)
    }

  }

  handleAllCheck =() => this.setState({allChecked: !this.state.allChecked})

  updateAuditStatus = (upData: Object) => {
    let formData ={
      accession_no : upData.Accession_No+"",
      audited:'N',
      type: 'notices'
    }
    this.props.updateAuditStatus(formData)
    this.setState({allChecked: true})
    let checkboxes = document.getElementsByTagName('input');
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].type === 'checkbox') {
        checkboxes[i].checked = false;
      }
    }
    setTimeout(() => {
      this.setState({allChecked: false})
      this.getDiscrepancyList()
    }, 400);
  }

  handleCheck =(e, disData) => {
    confirmAlert({
      title: 'Acknowlege this Report',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.updateAuditStatus(disData)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ],
      closeOnEscape: false,
      closeOnClickOutside: false,
    });
  }
  optionClicked = (optionsList: any) => {
    this.setState({pageLimit: optionsList.value, pageFilterLimit: optionsList})
    this.getDiscrepancyList(optionsList.value)
  }

  // Search Filter
  filterNotice = (event: any) => {
    let formData = {
      offset: 0, //currentPage * pageLimit,
      limit: this.state.pageLimit,
      type: 'notices',
      accession_no: this.state.accession_no
    }
    let userFilter = this.manageUserFilter()
    let postData = {...formData, ...userFilter}
    this.props.getDiscrepancy(postData)
  }

  handleChange = (e: any) => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  handleAccessChange = (e: any) => {
    const {name, value} = e.target
    this.setState({[name]: value})
    if (e.key === 'Enter') {
       let formData = {
        offset: 0, //currentPage * pageLimit,
        limit: this.state.pageLimit,
        type: 'notices',
        accession_no: value
      }
      let userFilter = this.manageUserFilter()
      let postData = {...formData, ...userFilter}
      this.props.getDiscrepancy(postData)
    }
  }

  render() {
    const pageNum = [
    {value: 15, label: 15},
    {value: 30, label: 30},
    {value: 50, label: 50},
    {value: 100, label: 100},
    ]
    const {pageLimit, pageFilterLimit, accession_no} = this.state
    const {match} = this.props
    let discrepancyList = idx(this.state, _ => _.discrepancyList)
      ? this.state.discrepancyList
      : []
    let disRow = null
    let totalDiscrepancy = (discrepancyList.length > 0) ? discrepancyList[0].totalcount : 0
    disRow = discrepancyList.map((dis, index) => {
      let tmpScanDate = dis.Scan_Received_Date.split("-");
      let scanDate = (tmpScanDate[0].length === 4) ? dis.Scan_Received_Date : dis.Scan_Received_Date.split("-").reverse().join("-");
      return (<tr key={index} style={{backgroundColor: dis.Reported === 'Reported' ? '#6af16a': '#fbaeae'}}>
        <td>{dis.Reported === 'Reported' ? 'Acknowleged' : 'Action & Acknowlege'}</td>
        <td>{dis.Scan_Received_Date && (<Moment format="Do MMMM YYYY">{scanDate}</Moment>)}</td>
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
          {dis.Reported !== 'Reported' && (<input type="checkbox" value='' onChange={e => this.handleCheck(e, dis)} />)}
        </td>
      </tr>
    )})
    return (
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                
                {match && match.path !== '/publicdiscrepancy' && (
                <div className="heading">
                  <h4 className="card-title mb-sm-0">Notices Dashboard</h4>
                  <div className="btn-container">
                    <div className="filter">
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Search By Accession No...."
                          onChange={e => this.handleChange(e)}
                          value={accession_no}
                          name="accession_no"
                          onKeyDown={e => this.handleAccessChange(e)}
                        />
                      </Form.Group>
                      <Button className="btn-primary" onClick={e => this.filterNotice(e)}>
                        <Icon icon={filter} />
                      </Button>
                    </div>
                  </div>
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
                {(totalDiscrepancy > 0) && (
                  <table className="table">
                  <tr><td style={{'width': '100px'}}>
                  <Select
                    name="pageFilter"
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    onChange={e => this.optionClicked(e)}
                    value={pageFilterLimit}
                    options={pageNum}
                  /></td><td><Pagination 
                  totalRecords={totalDiscrepancy} 
                  pageLimit={pageLimit} 
                  pageNeighbours={1} 
                  onPageChanged={this.onPageChanged} 
                /></td></tr></table>)}
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
  updateAuditStatus: (formData: Object) => {
    dispatch(auditActions.updateAuditStatus(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoticeList)