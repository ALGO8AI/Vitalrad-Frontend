// @flow
import React from 'react'
import {Button, Form, Modal} from 'react-bootstrap'
import {connect} from 'react-redux'
import idx from 'idx'
import {doctorActions, hospitalActions} from '../../_actions'
import FormValidator from '../../_helpers/FormValidator'

type Props = {
  doctor: any,
  doctorID: string,
  hospitals: Array<any>,
  updateDetail: Function,
  hospitalListing: Function,
  create: Function,
  detail: Function,
  alert: any,
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
  hospitalId: string,
  doctorId: string,
  hospitalList: any,
  validation: Object,
};

const checklength = (checklength: string) => {
  return checklength.length > 3 ? false : true
}

const checkPassword = (password: string, state: Object) => {
  if (state.doctorId !== '' && password.length === 0) {
    return false
  } else if (state.doctorId !== '' && password.length > 5) {
    return false
  } else if (state.doctorId === '' && password.length > 5) {
    return false
  } else {
    return true
  }
}
const validator = new FormValidator([
  {
    field: 'name',
    method: 'isEmpty',
    validWhen: false,
    message: 'Name is required.',
  },
  {
    field: 'code',
    method: 'isEmpty',
    validWhen: false,
    message: 'code is required.',
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
    message: 'Password length must be at least 3 characters long.',
  },
  {
    field: 'hospitalId',
    method: 'isEmpty',
    validWhen: false,
    message: 'Hospital is required.',
  },
])

export class DoctorFormPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      name: '',
      address: '',
      username: '',
      password: '',
      email: '',
      mobile: '',
      code: '',
      submitted: false,
      hospitalId: '',
      doctorId: '',
      hospitalList: [],
      validation: validator.valid(),
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
      const {name, address, code, username, password, email, mobile, hospitalId, doctorId} = this.state
      if (name && code && username) {
        let formData = {
          name: name,
          address: address,
          username: username,
          email: email,
          mobile: mobile,
          code: code,
          hospital_id: hospitalId,
          user_type: 'doctor',
        }
        if(password !==''){
          formData.password = password
        }
        if (doctorId && doctorId !== '') {
          formData._id = doctorId
          this.props.updateDetail(formData, doctorId)
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
      address: '',
      username: '',
      email: '',
      mobile: '',
      code: '',
      password: '',
      hospitalId: '',
      submitted: false,
      validation: validator.valid(),
    })
  }

  componentDidMount() {
    if (this.state.hospitalList.length === 0) {
      this.props.hospitalListing({"user_type": "hospital"})
    }
    //edit - get data
    if (this.props.doctorID && this.props.doctorID !== '') {
      const {doctorID} = this.props
      if (doctorID) {
        this.setState({doctorId: doctorID})
        let formData = {
          "_id" : doctorID,
          "user_type" : "doctor"
        }
        this.props.detail(formData)
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.hospitals) {
      this.setState({hospitalList: nextProps.hospitals})
    }

    //set data
    if (
      this.state.doctorId !== '' &&
      idx(nextProps, _ => _.doctor.doctorDetail._id) &&
      !nextProps.doctor.isProcessing
    ) {
      let {doctorDetail} = nextProps.doctor
      this.setState({
        name: doctorDetail.profile.name,
        address: doctorDetail.profile.address,
        code: doctorDetail.profile.code || '',
        username: doctorDetail.username,
        email: doctorDetail.profile.email || '',
        mobile: doctorDetail.profile.mobile || '',
        hospitalId: doctorDetail.profile.hospitalId,
      })
    }

    if (this.state.doctorId === '' && idx(nextProps, _ => _.doctor.doctor._id)) {
      this.clearState()
    }
  }

  render() {
    const {alert} = this.props
    const {isProcessing} = this.props.doctor || false
    const {name, address, code, username, password, email, mobile, submitted, hospitalId, doctorId} = this.state
    const hospitalList = this.state.hospitalList || []
    let validation
    validation = submitted // if the form has been submitted at least once
      ? validator.validate(this.state) // then check validity every time we render
      : this.state.validation // otherwise just use what's in state
    const hospitalRow = hospitalList.map((hospital, index) => (
      <option
        defaultValue={hospitalId}
        key={index}
        onChange={e => this.handleChange(e)}
        value={hospital._id}>
        {hospital.profile.name}
      </option>
    ))

    return (
      <div>
        <Modal.Header closeButton>
          <Modal.Title>{doctorId ? 'Edit' : 'Add'} Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert && alert.message && (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          )}
          <div className="hospital-detail">
            <div className="create-container">
              <Form name="form" onSubmit={e => this.handleSubmit(e)}>
                <Form.Group
                  className={validation.name.isInvalid ? ' has-error' : ''}>
                  <Form.Label>Doctor Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={e => this.handleChange(e)}
                  />
                  {validation.name.isInvalid && (
                    <div className="help-block">
                      {validation.name.message}
                    </div>
                  )}
                </Form.Group>
                <Form.Group
                  className={
                    validation.hospitalId.isInvalid ? ' has-error' : ''
                  }>
                  <Form.Label>Select Hospital</Form.Label>
                  <Form.Control
                    as="select"
                    name="hospitalId"
                    value={hospitalId}
                    onChange={e => this.handleChange(e)}>
                    <option value="">Select Hospital</option>
                    {hospitalRow}
                  </Form.Control>
                  {validation.hospitalId.isInvalid && (
                    <div className="help-block">
                      {validation.hospitalId.message}
                    </div>
                  )}
                </Form.Group>
                <Form.Group
                  className={validation.code.isInvalid ? ' has-error' : ''}>
                  <Form.Label>Doctor Code</Form.Label>
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
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => this.handleChange(e)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    value={mobile}
                    onChange={e => this.handleChange(e)}
                  />
                </Form.Group>
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
                <Button type="submit" className="btn btn-primary">
                  {doctorId ? 'Update' : 'Create'}
                </Button>
                {isProcessing && <div className="loader"></div>}
              </Form>
            </div>
          </div>
        </Modal.Body>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  doctor: state.doctor,
  hospitals: state.hospital.detail || [],
  alert: state.alert || false,
})

const mapDispatchToProps = dispatch => ({
  create: formData => {
    dispatch(doctorActions.create(formData))
  },
  updateDetail: (formData, doctorId) => {
    dispatch(doctorActions.updateDetail(formData, doctorId))
  },
  detail: formData => {
    dispatch(doctorActions.detail(formData))
  },
  hospitalListing: (formData) => {
    dispatch(hospitalActions.listing(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoctorFormPage)
