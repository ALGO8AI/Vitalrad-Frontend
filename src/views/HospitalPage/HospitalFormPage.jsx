// @flow
import React from 'react'
import {Button, Form, Modal} from 'react-bootstrap'
import {connect} from 'react-redux'
import idx from 'idx'
import {hospitalActions, auditActions, modalityActions, userActions} from '../../_actions'
import FormValidator from '../../_helpers/FormValidator'
import {capitalizeWord} from '../../_helpers'
import {Icon} from 'react-icons-kit'
import {minusCircle, plusCircle} from 'react-icons-kit/fa'

type Props = {
  hospital: any,
  modality: any,
  hospitalID: string,
  updateDetail: Function,
  getAuditFilters: Function,
  getModalities: Function,
  auditfilters: Object,
  getUser: Function,
  create: Function,
  detail: Function,
  alert: any,
}

type State = {
  name: string,
  address: string,
  username: string,
  password: string,
  modalityOption: Object,
  modality_details: Array<any>,
  email: string,
  mobile: string,
  code: string,
  submitted: boolean,
  modalityList: Array<any>,
  subModalityList: Array<any>,
  hospitalId: string,
  validation: Object,
  auditfilters: Object,
  userDetail: Object
};

const checklength = (checklength: string) => {
  return checklength.trim().length >= 3 ? false : true
}

const checkPassword = (password: string, state: Object) => {
  if (state.hospitalId !== '' && password.trim().length === 0) {
    return false
  } else if (state.hospitalId !== '' && password.trim().length >= 5) {
    return false
  } else if (state.hospitalId === '' && password.trim().length >= 5) {
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
])

export class HospitalFormPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.defaultOptions = {"modality" : "", "sub_modality": "", "tat" : '', "cost" : ''}
    this.state = {
      name: '',
      code: '',
      username: '',
      password: '',
      email: '',
      mobile: '',
      address: '',
      submitted: false,
      hospitalId: '',
      modalityOption: this.defaultOptions,
      modality_details:[this.defaultOptions],
      subModalityList: [],
      modalityList: [],
      auditfilters: {},
      userDetail: {},
      validation: validator.valid(),
    }
  }

  handleChange = (e: any) => {
    const {name, value} = e.target
    this.setState({[name]: value})
    if(name === 'name' ){
      let formData = {
        'user_type': 'hospital',
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
      const {name, code, username, password, email, mobile, address, hospitalId, modality_details} = this.state
      if (name && username) {
        let formData = {
          name: name,
          code: code,
          username: username,
          email: email,
          mobile: mobile,
          address : address,
          user_type: 'hospital',
          modality_details: modality_details,
          // status:'active'
        }
        if(password !==''){
          formData.password = password
        }
        if (hospitalId && hospitalId !== '') {
          formData._id = hospitalId
          this.props.updateDetail(formData, hospitalId)
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
      modality_details:[this.state.modalityOption],
      address: '',
      submitted: false,
      validation: validator.valid(),
    })
  }

  componentDidMount() {
    //edit - get data
    this.props.getAuditFilters()
    this.props.getModalities()
    if (this.props.hospitalID && this.props.hospitalID !== '') {
      const {hospitalID} = this.props
      if (hospitalID) {
        this.setState({hospitalId: hospitalID})
        let formData = {
          "_id" : hospitalID,
          "user_type" : "hospital"
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
      this.setState({userDetail: userDetail, code: hospital_number})
    }
    if (
      idx(nextProps, _ => _.hospital.hospital._id) &&
      this.state.hospitalId === ''
    ) {
      this.clearState()
    }
    if (nextProps.auditfilters && this.state.auditfilters !== nextProps.auditfilters ) {
      this.setState({auditfilters: nextProps.auditfilters})
    }

    if (idx(nextProps, _ => _.modality.detail)) {
      this.setState({modalityList: nextProps.modality.detail})
    }
    
    if (idx(nextProps, _ => _.hospital.isProcessing) &&
      this.state.submitted !== nextProps.hospital.isProcessing
    ) {
      this.setState({submitted: false})
    }

    //set data

    if (
      this.state.hospitalId !== '' &&
      idx(nextProps, _ => _.hospital.hospitalDetail._id) &&
      !nextProps.hospital.isProcessing
    ) {
      let {hospitalDetail} = nextProps.hospital
      let profileData = (idx(hospitalDetail, _ => _.profile.name)) ? hospitalDetail.profile : {} 
      this.setState({
        name: profileData.name || '',
        code: profileData.code || '',
        username: hospitalDetail.username,
        email: profileData.email || '',
        mobile: profileData.mobile || '',
        address: profileData.address || '',
        modality_details: profileData.modality_details || this.state.modality_details
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
      if(subModality.length > 0){
        let tmpSubMod = this.state.subModalityList
        tmpSubMod[index] = subModality[0].sub_modality
        this.setState({subModalityList: tmpSubMod})
      }
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
        <div className="col-md-3">
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
        <div className="col-md-3">
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
              name="tat"
              step="any"
              value={(cusRow.tat) ? cusRow.tat : ''}
              onChange={(e) => this.handleOptionsChange(index, e)}
            />
          </Form.Group>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <Form.Control
              type="number"
              name="cost"
              min="1"
              step="any"
              value={(cusRow.cost) ? cusRow.cost : ''}
              onChange={(e) => this.handleOptionsChange(index, e)}
            />
          </Form.Group>
        </div>
        <div className="col-md-1">
          {(this.state.hospitalId ==='' && options.length>1) && (<Icon icon={minusCircle} onClick={(e) => this.handleDelete(index, e)} />)}
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
    const {hospital, alert} = this.props
    let isProcessing =
      hospital && hospital.isProcessing ? hospital.isProcessing : false

    const {code, auditfilters, name, username, password, mobile, email, submitted, hospitalId, modality_details} = this.state
    let validation
    validation = submitted // if the form has been submitted at least once
      ? validator.validate(this.state) // then check validity every time we render
      : this.state.validation // otherwise just use what's in state
    const hospitalList = auditfilters['hospital'] || []
    const hospitalRow = hospitalList.map((hospital, index) => (<option
        defaultValue={name}
        key={index}
        onChange={e => this.handleChange(e)}
        value={hospital}>
        {hospital}
      </option>))

    return (
      <div>
        <Modal.Header closeButton>
          <Modal.Title>{hospitalId ? 'Update' : 'Create'} Hospital</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert && alert.message && (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          )}
          <div className="hospital-detail">
            <Form name="form" onSubmit={e => this.handleSubmit(e)}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group
                    className={validation.name.isInvalid ? ' has-error' : ''}>
                    <Form.Label>Hospital Name</Form.Label>
                    <Form.Control
                      as="select"
                      name="name"
                      value={name}
                      disabled={(hospitalId && name !=='') ? true : false}
                      onChange={e => this.handleChange(e)}>
                      <option value="">Select Hospital</option>
                      {hospitalRow}
                    </Form.Control>
                    {validation.name.isInvalid && (
                      <div className="help-block">{validation.name.message}</div>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group
                    className={validation.code.isInvalid ? ' has-error' : ''}>
                    <Form.Label>Hospital Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="code"
                      value={code}
                      onChange={e => this.handleChange(e)}
                    />
                    {validation.code.isInvalid && (
                      <div className="help-block">{validation.code.message}</div>
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
              <div className="row">
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
              {/*<div className="row">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      rows="3"
                      value={address}
                      onChange={e => this.handleChange(e)}
                    />
                  </Form.Group>
                </div>
              </div>*/}
              {((hospitalId !=='' && modality_details.length>0) || hospitalId==='') && (<React.Fragment><hr style={{height: 3}}/>
                <div className="row">
                  <div className="col-md-3">
                      <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>Modality</Form.Label>
                  </div>
                  <div className="col-md-3">
                      <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>Sub Modality</Form.Label>
                  </div>
                  <div className="col-md-3">
                      <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>TAT</Form.Label>
                  </div>
                  <div className="col-md-2">
                      <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>Cost</Form.Label>
                  </div>
                  <div className="col-md-1" style={{'marginBottom': '5px !important'}}>
                    <div style={{'marginBottom': '5px !important'}}>
                      <Icon icon={plusCircle} onClick={this.handleClick}/>
                    </div>
                  </div>
                </div>
                {this.customModalityRow(modality_details)}
              </React.Fragment>)}
              <div className="row">
                <div className="col-md-6">
                  <Button type="submit" className="btn btn-primary">
                    {hospitalId ? 'Update' : 'Create'}
                  </Button>
                  {isProcessing && <div className="loader"></div>}
                </div>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
  auditfilters: state.audit.auditfilters || [],
  modality: state.modality || null,
  hospital: state.hospital || null,
  alert: state.alert || false,
  userInfo: state.authentication.userInfo || [],
}}

const mapDispatchToProps = dispatch => ({
  create: formData => {
    dispatch(hospitalActions.create(formData))
  },
  updateDetail: (formData, hospitalId) => {
    dispatch(hospitalActions.updateDetail(formData, hospitalId))
  },
  getAuditFilters: () => {
    dispatch(auditActions.getAuditFilters())
  },
  getModalities: () => {
    dispatch(modalityActions.getModalities())
  },
  detail: formData => {
    dispatch(hospitalActions.detail(formData))
  },
  getUser: formData => {
    dispatch(userActions.getUser(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HospitalFormPage)
