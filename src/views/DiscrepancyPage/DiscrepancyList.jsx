// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import idx from 'idx'
import {discrepancyActions} from '../../_actions'
import Moment from 'react-moment'
import {Modal, Button, Badge} from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import ChatPage from './ChatPage'
import {Pagination} from '../../components/common';
import {authDetail, loggedInUser, capitalizeString} from '../../_helpers'
import DiscrepancyFormPage from './DiscrepancyFormPage'
import FeedbackFormPage from './FeedbackFormPage'
import Dialog from 'react-bootstrap-dialog'
import './right-modal.css'
import Select from 'react-select'
import parse from 'html-react-parser';
import makeAnimated from 'react-select/animated'
type Props = {
  getDiscrepancy: Function,
  discrepancies: Array<any>,
  createDiscrepancy: Function,
  updateDiscrepencyStatus: Function,
  updateNotifications: Function
}

type State = {
  showChat: boolean,
  discrepancyList: Array<any>,
  accessionNo: any,
  activeDisData: Object,
  currentPage: number,
  totalPages: number,
  pageLimit: number,
  loggedInUser:string,
  showModalFrom: string,
  pageFilterLimit: Object
};

const DisStatusClass = {
  'initial review complete' : 'yellow',
  'inprogress' : 'organge',
  'final review' : 'brown',
  'close' : 'blue'
}
const animatedComponents = makeAnimated()
class DiscrepancyList extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)

    this.state = {
      showChat: false,
      discrepancyList: [],
      accessionNo: '',
      activeDisData: null,
      totalPages: 0,
      pageLimit: 15,
      currentPage: 1,
      pageFilterLimit: {value: 15, label: 15},
      loggedInUser: loggedInUser(),
      showModalFrom: '',
    }
  }
  componentDidMount = () => {
    this.getDiscrepancyList()
  }
  
  manageUserFilter = () => {
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
          let radiologistName = (idx(authData, _ => _.detail.profile.name) && authData.detail.profile.name !=='') ? authData.detail.profile.name : ''
          formData.radiologist_name = radiologistName
        }
        break;
      case 'doctor':
        if(idx(authData, _ => _.detail.user_type)){
          let doctorId = (idx(authData, _ => _.detail.profile.code)) ? authData.detail.profile.code : '1001'
          formData.doctor_id = doctorId
          let doctorName = (idx(authData, _ => _.detail.profile.name) && authData.detail.profile.name !=='') ? authData.detail.profile.name : ''
          formData.doctor_name = doctorName
          let hospitalName = (idx(authData, _ => _.detail.profile.hospital_name)) ? authData.detail.profile.hospital_name[0] : 'Hospital 7'
          formData.hospital_name = hospitalName
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
      offset: 0,
      limit: (pageLimitOpt > 0) ? pageLimitOpt : pageLimit,
      "hospital_name" : "",
      "radiologist_id" : "",
      "doctor_id" : ""
    }
    let userFilter = this.manageUserFilter()
    let postData = {...formData, ...userFilter}
    this.props.getDiscrepancy(postData)
  }

  getName = () => {
    let authData = authDetail()
    let userName = ''
    if(loggedInUser() === 'superadmin') {
      userName = (idx(authData, _ => _.detail.username)) ? authData.detail.username : 'admin'
    }
    else
    {
      userName = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : 'Hospital 7'
    }
    return userName
  }

  // handleNoticiation = (notices) => {
  //   if(notices.length > 0){
  //     let noticesIdArr = notices.map(val => val.accession_no)
  //     let noticesId = noticesIdArr.filter((v, i, a) => a.indexOf(v) === i); 
  //     let formData = {name: this.getName(), accession_arr: noticesId}
  //     // this.props.updateNotifications(formData)
  //   } 
  // }

  UNSAFE_componentWillReceiveProps = (nextProps: any) => {
    if (nextProps.discrepancies) {
      this.setState({discrepancyList: nextProps.discrepancies})
    }
    // if (nextProps.notices && nextProps.notices.length > 0) {
    //   this.handleNoticiation(nextProps.notices)
    // }
  }

  openChat = (e: any, disObj: Object) => {
    this.setState({showChat: !this.state.showChat, activeDisData: disObj})
  }

  updateFinalStatus = (disObj: Object) => {    
    if (disObj.Accession_No) {
      let formData = {
        "accession_no" : disObj.Accession_No,
        "dis_raised_by" : disObj.Discrepency_Raised_by,
        "name" : this.getName(),
        "user_type" : this.state.loggedInUser
      }
      this.props.discrepencyFinalReview(formData)
      setTimeout(() => {
        this.getDiscrepancyList()
      }, 800);
    }
  }

  updateReopnDiscrepency = (disObj: Object, stateDis: any) => {   
    let formData = {
      accession_no: disObj.Accession_No,
      comment: disObj.Discrepency_Comment,
      dis_type: disObj.Discrepency_Type,
      user_type: this.state.loggedInUser,
      name: this.getName(),
      'updateType': 'reopen'
    }

    this.props.createDiscrepancy(formData)
    setTimeout(() => {
      this.getDiscrepancyList()
    }, 800);
  }
  
  confirmFinalStatus = (e: any, disObj: Object) => {
    //$FlowFixMe
    this.dialog.show({
      title: 'Send to Final Review',
      body: 'Are you sure you want to send this Discrepancy to final review?',
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          this.updateFinalStatus(disObj)
        }),
      ],
      bsSize: 'small',
      onHide: dialog => {
        dialog.hide()
      },
    })
  }

  reopenDiscrepancyStatus = (e: any, disObj: Object) => {
    //$FlowFixMe
    this.dialog.show({
      title: 'Re-open Discrepancy',
      body: 'Are you sure you want to Re-open?',
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          this.updateReopnDiscrepency(disObj, 'reopen')
        }),
      ],
      bsSize: 'small',
      onHide: dialog => {
        dialog.hide()
      },
    })
  }

  handleClose = (e: any) => {
    this.setState({showChat: false, accessionNo: '', activeDisData: null})
  }

  onPageChanged = (data : any) => {
    const { currentPage } = data;
    if(data.currentPage !== this.state.currentPage){
      this.setState({currentPage: currentPage })
      const {pageLimit} = this.state
      const offset = (currentPage - 1) * pageLimit;
      let formData = {
        offset: offset,
        limit: pageLimit
      }
      let userFilter = this.manageUserFilter()
      let postData = {...formData, ...userFilter}
      this.props.getDiscrepancy(postData)
    }

  }
  handleShow = (e: any, mType) => {
    this.setState({showModalFrom: mType})
  }

  handleFormClose = (e: any) => {
    this.setState({showModalFrom: ''})
    this.getDiscrepancyList()
  }

  closeDiscrepancy = (accession_no: string) => {
    if (accession_no) {
      let formData = {
        "accession_no" : accession_no,
        "status" :"close"
      }
      this.props.updateDiscrepencyStatus(formData)
      setTimeout(() => {
        this.getDiscrepancyList()
      }, 700);
    }
  }

  confirmCloseDiscrepancy = (e: any, accession_no: string) => {
    //$FlowFixMe
    this.dialog.show({
      title: 'Close Discrepancy',
      body: 'Are you sure you want to close this Discrepancy?',
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          this.closeDiscrepancy(accession_no)
        }),
      ],
      bsSize: 'small',
      onHide: dialog => {
        dialog.hide()
      },
    })
  }

  showBtn = (raised_by: string, dis: Object) => {
    let showBtnStatus = false
    if(dis.Discrepency_Status === 'final review'){
      if(loggedInUser() === 'superadmin' && ['superadmin', 'admin', 'Admin'].indexOf(raised_by) >=0){
        showBtnStatus = true
      }
      else if(this.getName() === raised_by){
        showBtnStatus = true
      }
      if(showBtnStatus){
        return (
          <span>
            <div className="badge badge-success p-2 white-color" title="Yes" onClick={e => this.confirmCloseDiscrepancy(e, dis.Accession_No)}><i className="icon-check menu-icon"></i>{' '}</div>
            <div className="badge badge-warning p-2 white-color" title="No" onClick={e => this.reopenDiscrepancyStatus(e, dis)}><i className="icon-close menu-icon"></i>{' '}</div>
          </span>
        )
      }
    }
  }

  showComment = (disObj: Object) => {
    let show = false
    switch(disObj.Discrepency_Status) {
      case 'open':
          show = true
        break;
      case 'inprogress':
        if(['superadmin', 'radiologist'].indexOf(this.state.loggedInUser) >= 0){
          show = true
        }
        break;
      case 'initial review complete':
        if(['superadmin', 'radiologist'].indexOf(this.state.loggedInUser) >= 0){
          show = true
        }
        break;
      case 'final review':
        if(this.getName() === disObj.Discrepency_Raised_by){
          show = true
        }
        break;
      case 'close':
          show = true
        break;
      default:
        show = false
    }
    //console.log('show', show)
    // if(((this.getName() === disObj.Discrepency_Raised_by && disObj.Discrepency_Status ==='final review') || 
    //   (['doctor', 'hospital'].indexOf(this.state.loggedInUser) < 0 && 
    //   ['inprogress', 'initial review complete', 'final review'].indexOf(disObj.Discrepency_Status) < 0))) {
    // show = true
    // }
    return show
  }
  optionClicked = (optionsList: any) => {
    this.setState({pageLimit: optionsList.value, pageFilterLimit: optionsList})
    this.getDiscrepancyList(optionsList.value)
  }
  render() {
    const pageNum = [
    {value: 15, label: 15},
    {value: 30, label: 30},
    {value: 50, label: 50},
    {value: 100, label: 100},
    ]
    const {activeDisData, pageLimit, showModalFrom, pageFilterLimit} = this.state
    const {match, alert} = this.props
    let discrepancyList = idx(this.state, _ => _.discrepancyList)
      ? this.state.discrepancyList
      : []
    let disRow = null
    let totalDiscrepancy = (discrepancyList.length > 0) ? discrepancyList[0].totalcount : 0
    disRow = discrepancyList.map((dis, index) => {
      let scanDate = null
      if(dis.Scan_Received_Date){
        let tmpScanDate = (dis.Scan_Received_Date) ? dis.Scan_Received_Date.split("-") : null;
        scanDate = (tmpScanDate && tmpScanDate[0].length === 4) ? dis.Scan_Received_Date : dis.Scan_Received_Date.split("-").reverse().join("-");
      }
      return (<tr key={index}>
        <td>{dis.Scan_Received_Date && (<Moment format="DD-MM-YYYY">{scanDate}</Moment>)}</td>
        <td>{dis.Discrepency_Raised_by}</td>
        <td data-tip type="light" data-for={'tip-'+dis.Accession_No}>{dis.Accession_No}
        <ReactTooltip  type="light" className="grey-border" id={'tip-'+dis.Accession_No} aria-haspopup='true' role='example' style={{'z-index':'9999999'}} >
          <table>
            <tbody>
              <tr><td className="tip-label">Accession No :</td><td className="tip-value">{dis.Accession_No}</td></tr>
              <tr><td className="tip-label">Discrepancy Raised by : </td><td className="tip-value">{dis.Discrepency_Raised_by}</td></tr>
              <tr><td className="tip-label">Discrepancy : </td><td className="tip-value">{dis.Discrepency_Comment && (parse(dis.Discrepency_Comment.replace(/([^\n]{0,150})\s/g, "$1\n<br>")))}</td></tr>
              <tr><td className="tip-label">Date : </td><td className="tip-value">{dis.Scan_Received_Date}</td></tr>
            </tbody>
          </table>
          <br />
          <h2 className="tip-value">Discrepancy Report</h2>
          <table>
            <tbody>
              <tr className="tip-label"><td>Patients Name : {dis.Patient_First_Name} {dis.Surname}</td><td>Hospital Name : {dis.Hospital_Name}</td><td>Hospital Number : {dis.Hospital_Number}</td></tr>
              <tr className="tip-label"><td>Scan Received Date : {dis.Scan_Received_Date}</td><td>Referred By : {dis.Referred_By}</td><td>Modality : {dis.Modality}</td></tr>
              <tr className="tip-label"><td>Body Part : {dis.Body_Part}</td><td>Tat Status : {dis.TAT_Status}</td><td></td></tr>
              <tr className="tip-label"><td>Audit Person : {dis.Reported_By}</td><td>Audit Category : {dis.Audit_Category}</td><td></td></tr>
            </tbody>
          </table>
        </ReactTooltip>
        </td>
        <td className="specifictd">{dis.Discrepency_Comment}</td>
        <td>
          <Badge variant="success p-2" className={DisStatusClass[dis.Discrepency_Status] ? DisStatusClass[dis.Discrepency_Status] : ''}>{dis.Discrepency_Status ? capitalizeString(dis.Discrepency_Status) : 'Open'}</Badge>
          {this.showBtn(dis.Discrepency_Raised_by, dis)}
        </td>
        <td>
          {(this.getName() === dis.Discrepency_Raised_by && dis.Discrepency_Status !== 'close') && (<div className="badge badge-info p-2" onClick={e => this.confirmCloseDiscrepancy(e, dis.Accession_No)}>Close</div>)}{' '}
          {(['superadmin'].indexOf(this.state.loggedInUser) >=0 && ['initial review complete'].indexOf(dis.Discrepency_Status) >=0) ? (<div className="badge badge-danger lightbrown p-2" title="Final Review" onClick={e => this.confirmFinalStatus(e, dis)}><i className="icon-settings menu-icon"></i>{' '}</div>) :('')}
          {(this.showComment(dis)) ? (<div className="badge badge-danger lightbrown p-2" title="Comment" onClick={e => this.openChat(e, dis)}><i className="icon-bubble menu-icon"></i></div>) : ('')}
        </td>
      </tr>
    )})
    return (
      <div className="content-wrapper">
        <Dialog
          ref={el => {
            //$FlowFixMe
            this.dialog = el
          }}
        />
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              {alert && alert.message && (
                <div className={`alert ${alert.type}`}>{alert.message}</div>
              )}
              <div className="card-body">
                {match && match.path !== '/publicdiscrepancy' && (<div className="heading">
                  <h4 className="card-title mb-sm-0">Discrepancy Dashboard</h4>
                  <div className="btn-container">
                    <div className="filter"></div>
                    {['doctor', 'hospital','superadmin'].indexOf(this.state.loggedInUser) >=0 && (<Button onClick={e => this.handleShow(e, 'discrepancy')}>
                      Create Discrepancy
                    </Button>)}
                    {['doctor', 'hospital','superadmin'].indexOf(this.state.loggedInUser) >=0 && (<Button onClick={e => this.handleShow(e, 'feedback')}>
                      Feedback
                    </Button>)}
                  </div>

                </div>)}
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="font-weight-bold">Date</th>
                        <th className="font-weight-bold">Raised By</th>
                        <th className="font-weight-bold">Accession No.</th>
                        <th className="font-weight-bold">Discrepancy</th>
                        <th className="font-weight-bold">Status</th>
                        <th className="font-weight-bold">Action</th>
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
                  /></td><td>
                  <Pagination 
                  totalRecords={totalDiscrepancy} 
                  pageLimit={pageLimit} 
                  pageNeighbours={1} 
                  onPageChanged={this.onPageChanged} 
                /></td></tr></table>)}
              </div>
              
              <Modal
                className="right fade add-chat"
                backdrop="static"
                size="lg"
                show={this.state.showChat}
                onHide={e => this.handleClose(e)}>
                <ChatPage activeDisData={activeDisData}/>
              </Modal>

              <Modal
                size="lg"
                backdrop="static"
                className="add-discrepancy"
                show={showModalFrom === 'discrepancy'}
                onHide={e => this.handleFormClose(e)}>
                <DiscrepancyFormPage  handleFormClose={this.handleFormClose}/>
              </Modal>
              <Modal
                size="lg"
                backdrop="static"
                className="add-discrepancy"
                show={showModalFrom === 'feedback'}
                onHide={e => this.handleFormClose(e)}>
                <FeedbackFormPage  handleFormClose={this.handleFormClose}/>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state =>({
  discrepancies: state.discrepancy.detail || [],
  notices: state.discrepancy.notices || [],
  alert: state.alert || false,
})

const mapDispatchToProps = dispatch => ({
  getDiscrepancy: (formData: Object) => {
    dispatch(discrepancyActions.listing(formData))
  },
  updateDiscrepencyStatus: (formData: Object) => {
    dispatch(discrepancyActions.updateDiscrepencyStatus(formData))
  },
  updateNotifications: (formData: Object) => {
    dispatch(discrepancyActions.updateNotifications(formData))
  },
  discrepencyFinalReview: (formData: Object) => {
    dispatch(discrepancyActions.discrepencyFinalReview(formData))
  },
  createDiscrepancy: formData => {
    dispatch(discrepancyActions.createDiscrepancy(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscrepancyList)