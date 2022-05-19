// @flow
import React from 'react'
import {Form, Modal} from 'react-bootstrap'
import {connect} from 'react-redux'
import idx from 'idx'
import {discrepancyActions} from '../../_actions'
import {authDetail, loggedInUser} from '../../_helpers'
// import dateformat from "dateformat"
// import * as moment from 'moment'

type Props = {
  getAccessionDetail: Function,
  alert: any,
  accessionInfo: Object,
  handleFormClose: Function,
  updateFeedback: Function
}

type State = {
  accession_no: string,
  Scan_Received_Date: string,
  Patient_First_Name: string,
  Surname: string,
  Modality: string,
  Audit_Category: string,
  Body_Part: string,
  Hospital_Number: string,
  Hospital_Name: string,
  Reported_By: string,
  loggedInUser:string,
  actionType: string
};

export class FeedbackFormPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      accession_no: '',
      Scan_Received_Date: '',
      Patient_First_Name: '',
      Surname: '',
      Modality: '',
      Audit_Category: '',
      Body_Part: '',
      Hospital_Number: '',
      Hospital_Name: '',
      Reported_By: '',
      loggedInUser: loggedInUser(),
      actionType: ''
    }
  }

  handleLike = (e: any, actType:string) => {
    this.setState({actionType: actType})
    let formData = {
      accession_no: this.state.accession_no,
      feedback: actType,
      dis_type: 'feedback'
    }
    this.props.updateFeedback(formData)
  }

  handleFilter = (e: any) => {
    e.preventDefault()
    // this.clearState()
    if(this.state.accession_no.trim().length > 0){
      let authData = authDetail()
      let hospitalName = ''
      switch(this.state.loggedInUser) {
      case 'hospital':
        if(idx(authData, _ => _.detail.user_type)){
          hospitalName = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : 'Hospital 7'
        }
        
        break;
      case 'doctor':
        if(idx(authData, _ => _.detail.user_type)){
          let tmpHospitalArr = (idx(authData, _ => _.detail.profile.hospital_name)) ? authData.detail.profile.hospital_name : ['Hospital 7']
          hospitalName = tmpHospitalArr[0]
        }
        break;
      default:
        break; 
    }
      let postData = {accession_no: this.state.accession_no, type: 'feedback', hospital_name: hospitalName}
      this.props.getAccessionDetail(postData)
    }
  }

  handleChange = (e: any) => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  clearState = () => {
    this.setState({
      accession_no: '',
      Scan_Received_Date: '',
      Patient_First_Name: '',
      Surname: '',
      Modality: '',
      Audit_Category: '',
      Body_Part: '',
      Hospital_Number: '',
      Hospital_Name: '',
      Reported_By: '',
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      idx(nextProps, _ => _.accessionInfo)) {
      let accessionInfo = nextProps.accessionInfo[0]
      if(accessionInfo){
        this.setState({
          Scan_Received_Date: (accessionInfo.Scan_Received_Date !== '') ? accessionInfo.Scan_Received_Date : '',
          Patient_First_Name: accessionInfo.Patient_First_Name || '',
          Surname: accessionInfo.Surname,
          Modality: accessionInfo.Modality || '',
          Audit_Category: accessionInfo.Audit_Category || '',
          Body_Part: accessionInfo.Body_Part || '',
          Hospital_Number: accessionInfo.Hospital_Number || '',
          Hospital_Name: accessionInfo.Hospital_Name || '',
          Reported_By: accessionInfo.Reported_By || '',
          actionType: (this.state.actionType !== '') ? this.state.actionType : accessionInfo.Feedback
        })
      }
    }
  }

  render() {
    const {alert} = this.props
    let isProcessing = false

    const {
      actionType,
      accession_no, 
      Scan_Received_Date, 
      Patient_First_Name, 
      Surname, 
      Modality, Audit_Category, Body_Part, Hospital_Number, Hospital_Name, Reported_By} = this.state
    return (
      <div>
        <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert && alert.message && (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          )}
          <div className="hospital-detail">
            <Form name="form" onSubmit={e => this.handleSubmit(e)}>
              <div className="row">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Accession No</Form.Label>
                    <Form.Control
                      type="text"
                      name="accession_no"
                      value={accession_no}
                      onChange={e => this.handleChange(e)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>&nbsp;</Form.Label>
                    <div type="button" style={{'marginTop': '22px'}} className="btn btn-primary" onClick={e => this.handleFilter(e)}>
                      <i className="icon-magnifier menu-icon"></i>
                    </div>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Scan Received Date</Form.Label>
                    <Form.Control
                      type="text"
                      name="Scan_Received_Date"
                      value={Scan_Received_Date}
                      readOnly={true}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Patient Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="Patient_First_Name"
                      value={Patient_First_Name+' '+ Surname}
                      readOnly={true}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Modality</Form.Label>
                    <Form.Control
                      type="text"
                      name="Modality"
                      value={Modality}
                      readOnly={true}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Audit Category</Form.Label>
                    <Form.Control
                      type="text"
                      name="Audit_Category"
                      value={Audit_Category}
                      readOnly={true}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Body Part</Form.Label>
                    <Form.Control
                      type="text"
                      name="Body_Part"
                      value={Body_Part}
                      readOnly={true}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Hospital</Form.Label>
                    <Form.Control
                      type="text"
                      name="Hospital_Number"
                      value={(Hospital_Name) ? Hospital_Name+' ('+Hospital_Number+')' : ''}
                      readOnly={true}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Reported By</Form.Label>
                    <Form.Control
                      type="text"
                      name="Reported_By"
                      value={Reported_By}
                      readOnly={true}
                    />
                  </Form.Group>
                </div>
              </div>
              {Scan_Received_Date && (<div className="row">
                <div className="col-md-6 feedback">
                  <Form.Label>{' '}</Form.Label>
                  {' '}
                  <div className={actionType==='up' ? 'badge badge-success' : 'badge'} onClick={e => this.handleLike(e, 'up')}>{' '}<i className="icon-like menu-icon"></i>{' '}</div>
                  {' '}
                  <div className={actionType==='down' ? 'badge badge-warning' : 'badge'} onClick={e => this.handleLike(e, 'down')}>{' '}<i className="icon-dislike menu-icon"></i>{' '}</div>
                </div>
              </div>)}
              {isProcessing && <div className="loader"></div>}
            </Form>
          </div>
        </Modal.Body>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  hospital: state.hospital || null,
  alert: state.alert || false,
  accessionInfo: state.discrepancy.accessioninfo || null,
})

const mapDispatchToProps = dispatch => ({
  updateFeedback: formData => {
    dispatch(discrepancyActions.updateFeedback(formData))
  },
  getAccessionDetail: (formData: Object) => {
    dispatch(discrepancyActions.getAccessionDetail(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedbackFormPage)
