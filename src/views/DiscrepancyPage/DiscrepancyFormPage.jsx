// @flow
import React from 'react'
import {Button, Form, Modal} from 'react-bootstrap'
import {connect} from 'react-redux'
import idx from 'idx'
import {discrepancyActions} from '../../_actions'
import FormValidator from '../../_helpers/FormValidator'
import {authDetail, loggedInUser, isAdmin} from '../../_helpers'
// import dateformat from "dateformat"

type Props = {
  createDiscrepancy: Function,
  getAccessionDetail: Function,
  alert: any,
  accessionInfo: Object,
  handleFormClose: Function
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
  submitted: boolean,
  validation: Object,
  comment: string,
  loggedInUser:string,
  discrepancy_type: string
};

const checklength = (checklength: string) => {
  return checklength.length >= 10 ? false : true
}

const validator = new FormValidator([
  {
    field: 'comment',
    method: checklength,
    validWhen: false,
    message: 'Comment must be at least 10 characters long.',
  },
])

export class DiscrepancyFormPage extends React.Component<Props, State> {
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
      submitted: false,
      Hospital_Number: '',
      Hospital_Name: '',
      Reported_By: '',
      comment: '',
      discrepancy_type: 'clinical',
      loggedInUser: loggedInUser(),
      validation: validator.valid()
    }
  }

  handleChange = (e: any) => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  handleFilter = (e: any) => {
    e.preventDefault()
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
      let postData = {accession_no: this.state.accession_no, type: 'discrepancy', hospital_name: hospitalName}
      if(isAdmin()){
        postData.issingle = 1
      }

      this.props.getAccessionDetail(postData)
    }
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    const validation = validator.validate(this.state)
    this.setState({validation})
    this.setState({submitted: true})
    let authData = authDetail();
    let userName = idx(authData, _ => _.detail.profile.name) ? authData.detail.profile.name : authData.detail.username
    if (validation.isValid) {
      const {comment, accession_no, Scan_Received_Date, discrepancy_type, loggedInUser} = this.state
      if (comment && accession_no && Scan_Received_Date !=='') {
        let formData = {
          accession_no: accession_no,
          comment: comment,
          dis_type: discrepancy_type,
          user_type: loggedInUser,
          name: userName
        }
        // console.log('formData', formData)
        this.props.createDiscrepancy(formData)
      }
    } else {
      this.setState({
        submitted: false,
      })
    }
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
      comment: '',
      submitted: false,
      discrepancy_type: 'clinical',
      validation: validator.valid()
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      idx(nextProps, _ => _.accessionInfo)) {
      let accessionInfo = nextProps.accessionInfo[0]
      if(accessionInfo){
        this.setState({
          Scan_Received_Date: accessionInfo.Scan_Received_Date || '',
          Patient_First_Name: accessionInfo.Patient_First_Name || '',
          Surname: accessionInfo.Surname,
          Modality: accessionInfo.Modality || '',
          Audit_Category: accessionInfo.Audit_Category || '',
          Body_Part: accessionInfo.Body_Part || '',
          Hospital_Number: accessionInfo.Hospital_Number || '',
          Hospital_Name: accessionInfo.Hospital_Name || '',
          Reported_By: accessionInfo.Reported_By || '',
        })
      }
    }
  }

  render() {
    // console.log('authDetail()', authDetail())
    const {alert} = this.props
    let isProcessing = false

    const {
      submitted,
      accession_no, 
      Scan_Received_Date, 
      Patient_First_Name, 
      Surname, 
      discrepancy_type,
      Modality, Audit_Category, Body_Part, Hospital_Number, Hospital_Name, Reported_By, comment} = this.state
    let validation
    validation = submitted // if the form has been submitted at least once
      ? validator.validate(this.state) // then check validity every time we render
      : this.state.validation // otherwise just use what's in state

    return (
      <div>
        <Modal.Header closeButton>
          <Modal.Title>Create Discrepancy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert && alert.message && (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          )}
          <div className="hospital-detail">
            <Form name="form" onSubmit={e => this.handleSubmit(e)}>
              <div className="row">
                <div className="col-md-6">
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
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Check inline label="Clinical" name="discrepancy_type" type={'radio'} id={`inline-radio-clinical`} value="clinical" checked={discrepancy_type === "clinical"} onChange={e => this.handleChange(e)}/>
                    <Form.Check inline label="Operational" name="discrepancy_type" type={'radio'} id={`inline-radio-operational`} value="operational" checked={discrepancy_type === "operational"} onChange={e => this.handleChange(e)}/>
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
              {(Scan_Received_Date) && (<div className="row">
                <div className="col-md-12">
                  <Form.Group className={validation.comment.isInvalid ? ' has-error' : ''}>
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="comment"
                      rows="3"
                      value={comment}
                      onChange={e => this.handleChange(e)}
                    />
                    {validation.comment.isInvalid && (
                      <div className="help-block">{validation.comment.message}</div>
                    )}
                  </Form.Group>
                </div>
              </div>)}
              {(Scan_Received_Date) && (<Button type="submit" className="btn btn-primary">
                Create
              </Button>)}
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
  createDiscrepancy: formData => {
    dispatch(discrepancyActions.createDiscrepancy(formData))
  },
  getAccessionDetail: (formData: Object) => {
    dispatch(discrepancyActions.getAccessionDetail(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscrepancyFormPage)
