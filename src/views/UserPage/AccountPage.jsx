// @flow
import React from 'react'
import {Button, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import idx from 'idx'
import {hospitalActions, modalityActions} from '../../_actions'
import FormValidator from '../../_helpers/FormValidator'
import {authDetail, loggedInUser} from '../../_helpers'
// import {Icon} from 'react-icons-kit'
// import {minusCircle, plusCircle} from 'react-icons-kit/fa'

type Props = {
  userData: any,
  match: any,
  updateDetail: Function,
  detail: Function,
  getModalities: Function,
  modality: any,
}

type State = {
  name: string,
  address: string,
  username: string,
  password: string,
  email: string,
  mobile: string,
  code: string,
  submitted: boolean,
  userId: string,
  validation: Object,
  modalityOption: Object,
  modality_details: Array<any>,
  modalityList: Array<any>,
  subModalityList: Array<any>,
  loggedInUser: string
};

const checklength = (checklength: string) => {
  return checklength.trim().length >= 3 ? false : true
}

const checkCodelength = (checklength: string) => {
  return checklength.trim().length >= 1 ? false : true
}

const checkPassword = (password: string, state: Object) => {
  if (state.userId !== '' && password.trim().length === 0) {
    return false
  } else if (state.userId !== '' && password.trim().length >= 5) {
    return false
  } else if (state.userId === '' && password.trim().length >= 5) {
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
    method: checkCodelength,
    validWhen: false,
    message: 'Code length must be at least 1 characters long.',
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

export class AccountPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    if(loggedInUser()==='radiologist')
    {
      this.defaultOptions = {"modality" : "", "sub_modality": "", "cost" : ''}
    }
    else{
      this.defaultOptions = {"modality" : "", "sub_modality": "", "tat" : '', "cost" : ''}
    }
    this.state = {
      name: '',
      code: '',
      username: '',
      password: '',
      email: '',
      mobile: '',
      address: '',
      submitted: false,
      userId: '',
      modalityOption: this.defaultOptions,
      modality_details:[this.defaultOptions],
      subModalityList: [],
      modalityList: [],
      validation: validator.valid(),
      loggedInUser: loggedInUser()
    }
  }

  handleChange = (e: any) => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    const validation = validator.validate(this.state)
    this.setState({validation})
    this.setState({submitted: true})
    if (validation.isValid) {
      const {code, loggedInUser, name, username, password, email, mobile, address, userId,modality_details} = this.state
      if (name && username) {
        let formData = {
          name: name,
          code: code,
          username: username,
          email: email,
          mobile: mobile,
          address : address,
          user_type: loggedInUser,
          // status:'active'
        }
        if(loggedInUser ==='hospital' || loggedInUser === 'radiologist'){
          formData.modality_details = modality_details
        }
        if(password !==''){
          formData.password = password
        }
        if (userId && userId !== '') {
          formData._id = userId
          this.props.updateDetail(formData, userId)
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

  componentDidMount() {
    if(this.state.loggedInUser==='hospital' || this.state.loggedInUser==='radiologist'){
      this.props.getModalities()
    }
    let authData = authDetail()
    //edit - get data
    if (authData.detail && authData.detail._id) {
      const userID = authData.detail._id
      if (userID) {
        this.setState({userId: userID})
        let formData = {
          "_id" : userID,
          "user_type" : this.state.loggedInUser
        }
        setTimeout(() => {
          this.props.detail(formData)
        }, 700);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      idx(nextProps, _ => _.userData.isProcessing) &&
      this.state.submitted !== nextProps.userData.isProcessing
    ) {
      this.setState({submitted: false})
    }
    if (idx(nextProps, _ => _.modality.detail)) {
      this.setState({modalityList: nextProps.modality.detail})
    }

    //set data
    if (
      this.state.userId !== '' &&
      idx(nextProps, _ => _.userData._id) &&
      !nextProps.userData.isProcessing
    ) {
      let {userData} = nextProps
      let profileData = (idx(userData, _ => _.profile.name)) ? userData.profile : {} 
      this.setState({
        name: profileData.name || '',
        code: profileData.code || '',
        username: userData.username,
        email: profileData.email || '',
        mobile: profileData.mobile || '',
        address: profileData.address || '',
      })
      if((this.state.loggedInUser==='hospital' || this.state.loggedInUser==='radiologist') && idx(profileData, _ => _.modality_details)){
        this.setState({modality_details: profileData.modality_details})
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
        {mod.modality}
      </option>))
    return modalityRow;
  }

  handelSubModalityRow = (optvalue, index) => {
    if(idx(this.state, _ => _.modalityList[0].modality)){
      let subModality = this.state.modalityList.filter(val => val.modality === optvalue)
      
      let tmpSubMod = this.state.subModalityList
      tmpSubMod[index] = subModality[0].sub_modality
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
          {mod}
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
        {this.state.loggedInUser==='hospital' && (<div className="col-md-3">
          <Form.Group>
            <Form.Control
              type="text"
              name="tat"
              value={cusRow.tat}
              onChange={(e) => this.handleOptionsChange(index, e)}
            />
          </Form.Group>
        </div>)}
        <div className="col-md-3">
          <Form.Group>
            <Form.Control
              type="number"
              min="1"
              name="cost"
              step="any"
              value={cusRow.cost}
              onChange={(e) => this.handleOptionsChange(index, e)}
            />
          </Form.Group>
        </div>
        {/*<div className="col-md-1">
          <Icon icon={minusCircle} onClick={(e) => this.handleDelete(index, e)} />
        </div>*/}
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
    const {userData, alert} = this.props
    let isProcessing =
      userData && userData.isProcessing ? userData.isProcessing : false

    const {name, code, username, password, mobile, email, address, submitted, userId, loggedInUser, modality_details} = this.state
    let validation
    validation = submitted // if the form has been submitted at least once
      ? validator.validate(this.state) // then check validity every time we render
      : this.state.validation // otherwise just use what's in state
    return (
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="heading">
                  <h2>Profile</h2>
                </div>
                {alert && alert.message && (
                  <div className={`alert ${alert.type}`}>{alert.message}</div>
                )}
                <div className="hospital-detail">
                  <Form name="form" onSubmit={e => this.handleSubmit(e)}>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group
                          className={validation.name.isInvalid ? ' has-error' : ''}>
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={name}
                            disabled={true}
                            onChange={e => this.handleChange(e)}
                          />
                          {validation.name.isInvalid && (
                            <div className="help-block">{validation.name.message}</div>
                          )}
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group
                          className={validation.code.isInvalid ? ' has-error' : ''}>
                          <Form.Label>Code</Form.Label>
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
                        <Form.Group>
                          <Form.Label>Username</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={username}
                            disabled={true}
                          />
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
                    {modality_details.length > 0 && (loggedInUser==='hospital' || loggedInUser==='radiologist') && (<React.Fragment>
                      <hr style={{height: 3}}/>
                      <div className="row">
                        <div className="col-md-3">
                            <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>Modality</Form.Label>
                        </div>
                        <div className="col-md-3">
                            <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>Sub Modality</Form.Label>
                        </div>
                        {loggedInUser==='hospital' && (<div className="col-md-3">
                            <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>TAT</Form.Label>
                        </div>)}
                        <div className="col-md-3">
                            <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>Cost</Form.Label>
                        </div>
                        {/*<div className="col-md-1" style={{'margin-bottom': '5px !important'}}>
                          <div style={{'margin-bottom': '5px !important'}}>
                            <Icon icon={plusCircle} onClick={this.handleClick}/>
                          </div>
                        </div>*/}
                      </div>
                      {this.customModalityRow(modality_details)}
                    </React.Fragment>)}
                    <div className="row">
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
                      <div className="col-md-6">
                        <Button type="submit" className="btn btn-primary mt-4">
                          {userId ? 'Update' : 'Create'}
                        </Button>
                        {isProcessing && <div className="loader"></div>}
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
  modality: state.modality || null,
  userData: state.hospital.hospitalDetail || null,
  alert: state.alert || false,
}}

const mapDispatchToProps = dispatch => ({
  create: formData => {
    dispatch(hospitalActions.create(formData))
  },
  getModalities: () => {
    dispatch(modalityActions.getModalities())
  },
  updateDetail: (formData, userId) => {
    dispatch(hospitalActions.updateDetail(formData, userId))
  },
  detail: formData => {
    dispatch(hospitalActions.detail(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountPage)
