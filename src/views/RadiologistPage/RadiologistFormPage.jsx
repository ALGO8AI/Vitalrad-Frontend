// @flow
import React from 'react'
import {Button, Form, Modal} from 'react-bootstrap'
import {connect} from 'react-redux'
import idx from 'idx'
import {radiologistActions, auditActions, modalityActions, userActions} from '../../_actions'
import FormValidator from '../../_helpers/FormValidator'
import {authDetail, loggedInUser} from '../../_helpers'
import {capitalizeWord} from '../../_helpers'
import {Icon} from 'react-icons-kit'
import {minusCircle, plusCircle} from 'react-icons-kit/fa'

type Props = {
  radiologist: any,
  radiologistID: string,
  updateDetail: Function,
  getAuditFilters: Function,
  auditfilters: Object,
  create: Function,
  detail: Function,
  alert: any,
  hospitals: Array<any>,
  modality: any,
  getModalities: Function,
  getUser: Function,
  userInfo: any,
}

type State = {
  name: string,
  address: string,
  username: string,
  password: string,
  hospitalName: string,
  email: string,
  mobile: string,
  code: string,
  submitted: boolean,
  radiologistId: string,
  validation: Object,
  hospitalId: string,
  auditfilters: Object,
  modalityOption: Object,
  modality_details: Array<any>,
  modalityList: Array<any>,
  subModalityList: Array<any>,
  userDetail: Object
};

const checklength = (checklength: string) => {
  return checklength.trim().length >= 3 ? false : true
}

const checkPassword = (password: string, state: Object) => {
  if (state.radiologistId !== '' && password.trim().length === 0) {
    return false
  } else if (state.radiologistId !== '' && password.trim().length >= 5) {
    return false
  } else if (state.radiologistId === '' && password.trim().length >= 5) {
    return false
  } else {
    return true
  }
}

const checkPhonenumber = (mobile: string ) => {
  var phoneno = /^\d{10}$/;
  if(mobile !==''){
    return (mobile.match(phoneno)) ? false : true
  }
  else{
    return false;
  }
}

const checkEmail = (checkEmail: string) => {
  var emailReg = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g
  return !checkEmail.match(emailReg)
}

const validator = new FormValidator([
  {
    field: 'name',
    method: 'isEmpty',
    validWhen: false,
    message: 'Name is required.',
  },
  {
    field: 'name',
    method: checklength,
    validWhen: false,
    message: 'Name length must be at least 3 characters long.',
  },
  {
    field: 'code',
    method: 'isEmpty',
    validWhen: false,
    message: 'code is required.',
  },
  {
    field: 'code',
    method: checklength,
    validWhen: false,
    message: 'Code length must be at least 3 characters long.',
  },
  {
    field: 'username',
    method: 'isEmpty',
    validWhen: false,
    message: 'Username is required.',
  },
  {
    field: 'username',
    method: checklength,
    validWhen: false,
    message: 'Username length must be at least 3 characters long.',
  },
  {
    field: 'password',
    method: checkPassword,
    validWhen: false,
    message: 'Password length must be at least 5 characters long.',
  },
  {
    field: 'email',
    method: checkEmail,
    validWhen: false,
    message: 'Please enter valid Email.',
  },
  {
    field: 'mobile',
    method: checkPhonenumber,
    validWhen: false,
    message: 'Invalid Mobile number. Mobile must be 10 digit',
  },  
  {
    field: 'hospitalId',
    method: 'isEmpty',
    validWhen: false,
    message: 'Hospital is required.',
  },
])

export class RadiologistFormPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.defaultOptions = {"modality" : "", "sub_modality": "", "tat" : '', "cost" : ''}
    this.state = {
      name: '',
      code: '',
      username: '',
      password: '',
      hospitalName: '',
      email: '',
      mobile: '',
      address: '',
      submitted: false,
      radiologistId: '',
      hospitalId: '',
      auditfilters: {},
      validation: validator.valid(),
      modalityOption: this.defaultOptions,
      modality_details:[this.defaultOptions],
      subModalityList: [],
      modalityList: [],
      userDetail: {},
    }
  }

  handleChange = (e: any) => {
    const {name, value} = e.target
    this.setState({[name]: value})
    if(name === 'name' ){
      let formData = {
        'user_type': 'radiologist',
        name: value
      }
      this.props.getUser(formData)
    }
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    const validation = validator.validate(this.state)
    this.setState({validation})
    this.setState({submitted: true})
    if (validation.isValid) {
      const { name, code, hospitalName, username, password, email, mobile, address, hospitalId, radiologistId, modality_details} = this.state
      if (name && username) {
        let formData = {
          name: name,
          code: code,
          username: username,
          email: email,
          mobile: mobile,
          address : address,
          hospital_id: hospitalId,
          user_type: 'radiologist',
          modality_details: modality_details,
          hospital_name: hospitalName,
          // status:'active'
        }
        if(password !==''){
          formData.password = password
        }
        if (radiologistId && radiologistId !== '') {
          formData._id = radiologistId
          this.props.updateDetail(formData, radiologistId)
        } else {
          this.props.create(formData)
        }
      }
    } else {
      this.setState({
        submitted: false,
      })
    }
  }

  clearState = () => {
    this.setState({
      name: '',
      code: '',
      username: '',
      password: '',
      email: '',
      mobile: '',
      address: '',
      hospitalName: '',
      modality_details:[this.state.modalityOption],
      hospitalId: '',
      submitted: false,
      userDetail: {},
      validation: validator.valid(),
    })
  }

  componentDidMount() {
    this.props.getModalities()
    if(loggedInUser() ==='hospital'){
      let authData = authDetail() 
      let hospitalId = (idx(authData, _ => _.detail._id)) ? authData.detail._id : null 
      this.setState({hospitalId : hospitalId})
    }
    this.props.getAuditFilters()
    //edit - get data
    if (this.props.radiologistID && this.props.radiologistID !== '') {
      const {radiologistID} = this.props
      if (radiologistID) {
        this.setState({radiologistId: radiologistID})
        let formData = {
          "_id" : radiologistID,
          "user_type" : "radiologist"
        }
        setTimeout(() => {
          this.props.detail(formData)
        }, 700);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.userInfo && this.state.name !=='') {
      let userDetail = (nextProps.userInfo[0]) ? nextProps.userInfo[0] : {}
      let hospital_number = (userDetail.Hospital_Number) ? userDetail.Hospital_Number : ''
      let Hospital_Name = (userDetail.Hospital_Name) ? userDetail.Hospital_Name : ''
      let radio_code = (userDetail.Radiologist_Id) ? userDetail.Radiologist_Id : ''
      this.setState({userDetail: userDetail, hospitalId: hospital_number, code:radio_code, hospitalName: Hospital_Name})
    }
    if (nextProps.auditfilters && this.state.auditfilters !== nextProps.auditfilters ) {
      this.setState({auditfilters: nextProps.auditfilters})
    }
    if (idx(nextProps, _ => _.modality.detail)) {
      this.setState({modalityList: nextProps.modality.detail})
    }
    if (
      idx(nextProps, _ => _.radiologist.radiologist._id) &&
      this.state.radiologistId === ''
    ) {
      this.clearState()
    }
    if (
      idx(nextProps, _ => _.radiologist.isProcessing) &&
      this.state.submitted !== nextProps.radiologist.isProcessing
    ) {
      this.setState({submitted: false})
    }

    //set data

    if (
      this.state.radiologistId !== '' &&
      idx(nextProps, _ => _.radiologist.radiologistDetail._id) &&
      !nextProps.radiologist.isProcessing
    ) {
      let {radiologistDetail} = nextProps.radiologist
      let profileData = (idx(radiologistDetail, _ => _.profile.name)) ? radiologistDetail.profile : {} 
      this.setState({
        name: profileData.name || '',
        code: profileData.code || '',
        username: radiologistDetail.username,
        email: profileData.email || '',
        mobile: profileData.mobile || '',
        address: profileData.address || '',
        hospitalId: profileData.hospital_id || '',
        modality_details: profileData.modality_details || this.state.modality_details,
        hospitalName: profileData.hospital_name[0],        
      })
      if(idx(profileData, _ => _.modality_details)){
        profileData.modality_details.map((mod, index) => this.handelSubModalityRow(mod.modality,index))
      }
    }
  }

  handleOptionsChange = (index, e) => {
    let { value, name } = e.target;
    if(name ==='modality'){
      this.handelSubModalityRow(value,index)
    }
    let stateOptionsClone = JSON.parse(JSON.stringify(this.state.modality_details));
    stateOptionsClone[index][name] = value;
    this.setState({ modality_details: stateOptionsClone });
  }

  modalityRow = (option) => {
    const modalityList = this.state.modalityList || []
    const modalityRow = modalityList.map((mod, index) => (<option
        key={index}
        defaultValue={option}
        onChange={e => this.handleChange(e)}
        value={mod.modality}>
        {capitalizeWord(mod.modality)}
      </option>))
    return modalityRow;
  }

  handelSubModalityRow = (optvalue, index) => {
    if(idx(this.state, _ => _.modalityList[0].modality)){
      let subModality = this.state.modalityList.filter(val => val.modality === optvalue)
      
      let tmpSubMod = this.state.subModalityList
      if(subModality.length > 0){
        tmpSubMod[index] = subModality[0].sub_modality
      }
      this.setState({subModalityList: tmpSubMod})
    }
  }

  subModalityRow = (index, option) => {
    if(idx(this.state, _ => _.modalityList) && this.state.modalityList.length > 0 && idx(this.state, _ => _.subModalityList[index])){
      const subModalityList = this.state.subModalityList[index] || []
      const subModalityRow = subModalityList.map((mod, index) => (<option
          key={index}
          defaultValue={option}
          onChange={e => this.handleChange(e)}
          value={mod}>
          {capitalizeWord(mod)}
        </option>))
      return subModalityRow;
    }
  }

  customModalityRow = (options) => {
    const listItems = options.map((cusRow, index) =>
      <div className="row" key={index}>
        <div className="col-md-4">
          <Form.Group>
            <Form.Control
              as="select"
              name="modality"
              value={cusRow.modality}
              onChange={(e) => this.handleOptionsChange(index, e)}>
              <option value="">Select Modality</option>
              {this.modalityRow(cusRow.modality)}
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group>
            <Form.Control
              as="select"
              name="sub_modality"
              value={cusRow.sub_modality}
              onChange={(e) => this.handleOptionsChange(index, e)}>
              <option value="">Select Sub-Modality</option>
              {this.subModalityRow(index, cusRow.sub_modality)}
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Control
              type="number"
              min="1"
              step="any"
              name="cost"
              value={cusRow.cost}
              onChange={(e) => this.handleOptionsChange(index, e)}
            />
          </Form.Group>
        </div>
        <div className="col-md-1">
          {(this.state.radiologistId ==='' && options.length>1) && (<Icon icon={minusCircle} onClick={(e) => this.handleDelete(index, e)} />)}
        </div>
      </div>
    );
    return (
      listItems
    )
  }

  handleDelete = (index, e) => {
    let stateClone = JSON.parse(JSON.stringify(this.state.modality_details));
    stateClone.splice(index, 1);
    this.setState({ modality_details: stateClone });
    e.preventDefault();
  }

  handleClick = (e) => {
    const {modalityOption, modality_details} = this.state
    let modality_details_tmp = JSON.parse(JSON.stringify(modality_details))
    modality_details_tmp.push(modalityOption);
    this.setState({ modality_details: modality_details_tmp});
    e.preventDefault();
  }

  render() {
    const {radiologist, alert} = this.props
    let isProcessing =
      radiologist && radiologist.isProcessing ? radiologist.isProcessing : false
    const {modality_details, code, name, auditfilters, username, password, mobile, email, submitted, radiologistId} = this.state
    let validation
    validation = submitted // if the form has been submitted at least once
      ? validator.validate(this.state) // then check validity every time we render
      : this.state.validation // otherwise just use what's in state
    
    const radiolList = auditfilters['radiologist'] || []
    const radiolRow = radiolList.map((radiologist, index) => (<option
        defaultValue={name}
        key={index}
        onChange={e => this.handleChange(e)}
        value={radiologist}>
        {radiologist}
      </option>))

    return (
      <div>
        <Modal.Header closeButton>
          <Modal.Title>{radiologistId ? 'Update' : 'Create'} Radiologist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert && alert.message && (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          )}
          <div className="radiologist-detail">
            <Form name="form" onSubmit={e => this.handleSubmit(e)}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group
                    className={validation.name.isInvalid ? ' has-error' : ''}>
                    <Form.Label>Radiologist Name</Form.Label>
                    <Form.Control
                      as="select"
                      name="name"
                      value={name}
                      disabled={(radiologistId && name !=='') ? true : false}
                      onChange={e => this.handleChange(e)}>
                      <option value="">Select Name</option>
                      {radiolRow}
                    </Form.Control>
                    {validation.name.isInvalid && (
                      <div className="help-block">{validation.name.message}</div>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group
                    className={validation.code.isInvalid ? ' has-error' : ''}>
                    <Form.Label>Radiologist Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="code"
                      value={code}
                      disabled={true}
                    />
                    {validation.code.isInvalid && (
                      <div className="help-block">{validation.code.message}</div>
                    )}
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                {/*<div className="col-md-6">
                  <Form.Group
                    className={
                      validation.hospitalId.isInvalid ? ' has-error' : ''
                    }>
                    <Form.Label>Select Hospital</Form.Label>
                    <Form.Control
                      type="text"
                      name="hospitalId"
                      value={hospitalName}
                      disabled={true}
                    />
                    {validation.hospitalId.isInvalid && (
                      <div className="help-block">
                        {validation.hospitalId.message}
                      </div>
                    )}
                  </Form.Group>
                </div>*/}
                <div className="col-md-6">
                  <Form.Group className={validation.email.isInvalid ? ' has-error' : ''}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={e => this.handleChange(e)}
                    />
                    {validation.email.isInvalid && (
                      <div className="help-block">{validation.email.message}</div>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className={validation.mobile.isInvalid ? ' has-error' : ''}>
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      type="text"
                      name="mobile"
                      value={mobile}
                      onChange={e => this.handleChange(e)}
                    />
                    {validation.mobile.isInvalid && (
                      <div className="help-block">{validation.mobile.message}</div>
                    )}
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group
                    className={validation.username.isInvalid ? ' has-error' : ''}>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={username}
                      onChange={e => this.handleChange(e)}
                    />
                    {validation.username.isInvalid && (
                      <div className="help-block">{validation.username.message}</div>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group
                    className={validation.password.isInvalid ? ' has-error' : ''}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={password}
                      onChange={e => this.handleChange(e)}
                    />
                    {validation.password.isInvalid && (
                      <div className="help-block">{validation.password.message}</div>
                    )}
                  </Form.Group>
                </div>
              </div>
              {/*<div className="row">
                <div className="col-md-6">
                  <Form.Group className={validation.mobile.isInvalid ? ' has-error' : ''}>
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      type="text"
                      name="mobile"
                      value={mobile}
                      onChange={e => this.handleChange(e)}
                    />
                    {validation.mobile.isInvalid && (
                      <div className="help-block">{validation.mobile.message}</div>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={address}
                      onChange={e => this.handleChange(e)}
                    />
                  </Form.Group>
                </div>
              </div>*/}
              {((radiologistId !=='' && modality_details.length>0) || radiologistId==='') && (<React.Fragment>
                <hr style={{height: 3}}/>
                <div className="row">
                  <div className="col-md-4">
                      <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>Modality</Form.Label>
                  </div>
                  <div className="col-md-4">
                      <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>Sub Modality</Form.Label>
                  </div>
                  <div className="col-md-3">
                      <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>Cost</Form.Label>
                  </div>
                  <div className="col-md-1" style={{'margin-bottom': '5px !important'}}>
                    <div style={{'margin-bottom': '5px !important'}}>
                      <Icon icon={plusCircle} onClick={this.handleClick}/>
                    </div>
                  </div>
                </div>
                {this.customModalityRow(modality_details)}
              </React.Fragment>)}
              <Button type="submit" className="btn btn-primary">
                {radiologistId ? 'Update' : 'Create'}
              </Button>
              {isProcessing && <div className="loader"></div>}
            </Form>
          </div>
        </Modal.Body>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auditfilters: state.audit.auditfilters || [],
  modality: state.modality || null,
  radiologist: state.radiologist || null,
  hospitals: state.hospital.detail || [],
  alert: state.alert || false,
  userInfo: state.authentication.userInfo || [],
})

const mapDispatchToProps = dispatch => ({
  create: formData => {
    dispatch(radiologistActions.create(formData))
  },
  getAuditFilters: () => {
    dispatch(auditActions.getAuditFilters())
  },
  updateDetail: (formData, radiologistId) => {
    dispatch(radiologistActions.updateDetail(formData, radiologistId))
  },
  getModalities: () => {
    dispatch(modalityActions.getModalities())
  },
  detail: formData => {
    dispatch(radiologistActions.detail(formData))
  },
  getUser: formData => {
    dispatch(userActions.getUser(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RadiologistFormPage)
