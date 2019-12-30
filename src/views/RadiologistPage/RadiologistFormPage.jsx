// @flow
import React from 'react'
import {Button, Form, Modal} from 'react-bootstrap'
import {connect} from 'react-redux'
import idx from 'idx'
import {radiologistActions, hospitalActions} from '../../_actions'
import FormValidator from '../../_helpers/FormValidator'

type Props = {
  radiologist: any,
  radiologistID: string,
  updateDetail: Function,
  create: Function,
  detail: Function,
  alert: any,
  hospitals: Array<any>,
  hospitalListing: Function,
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
  radiologistId: string,
  validation: Object,
  hospitalId: string,
  hospitalList: any,
};

const checklength = (checklength: string) => {
  return checklength.length > 3 ? false : true
}

const checkPassword = (password: string, state: Object) => {
  if (state.radiologistId !== '' && password.length === 0) {
    return false
  } else if (state.radiologistId !== '' && password.length > 5) {
    return false
  } else if (state.radiologistId === '' && password.length > 5) {
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

export class RadiologistFormPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      name: '',
      code: '',
      username: '',
      password: '',
      email: '',
      mobile: '',
      address: '',
      submitted: false,
      radiologistId: '',
      hospitalId: '',
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
      const {name, code, username, password, email, mobile, address, hospitalId, radiologistId} = this.state
      if (name && code) {
        let formData = {
          name: name,
          code: code,
          username: username,
          email: email,
          mobile: mobile,
          address : address,
          hospital_id: hospitalId,
          user_type: 'radiologist',
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
    if (this.props.radiologistID && this.props.radiologistID !== '') {
      const {radiologistID} = this.props
      if (radiologistID) {
        this.setState({radiologistId: radiologistID})
        let formData = {
          "_id" : radiologistID,
          "user_type" : "radiologist"
        }
        this.props.detail(formData)
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.hospitals) {
      this.setState({hospitalList: nextProps.hospitals})
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
      this.setState({
        name: radiologistDetail.profile.name || '',
        code: radiologistDetail.profile.code || '',
        username: radiologistDetail.username,
        email: radiologistDetail.profile.email || '',
        mobile: radiologistDetail.profile.mobile || '',
        address: radiologistDetail.profile.address || '',
      })
    }
  }

  render() {
    const {radiologist, alert} = this.props
    let isProcessing =
      radiologist && radiologist.isProcessing ? radiologist.isProcessing : false
    const hospitalList = this.state.hospitalList || []
    const {name, code, username, password, mobile, email, address, submitted, hospitalId, radiologistId} = this.state
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
          <Modal.Title>{radiologistId ? 'Edit' : 'Create'} Radiologist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert && alert.message && (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          )}
          <div className="radiologist-detail">
            <div className="create-container">
              <Form name="form" onSubmit={e => this.handleSubmit(e)}>
                <Form.Group
                  className={validation.name.isInvalid ? ' has-error' : ''}>
                  <Form.Label>Radiologist Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={e => this.handleChange(e)}
                  />
                  {validation.name.isInvalid && (
                    <div className="help-block">{validation.name.message}</div>
                  )}
                </Form.Group>
                <Form.Group
                  className={validation.code.isInvalid ? ' has-error' : ''}>
                  <Form.Label>Radiologist Code</Form.Label>
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
                  {radiologistId ? 'Update' : 'Create'}
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
  radiologist: state.radiologist || null,
  hospitals: state.hospital.detail || [],
  alert: state.alert || false,
})

const mapDispatchToProps = dispatch => ({
  create: formData => {
    dispatch(radiologistActions.create(formData))
  },
  updateDetail: (formData, radiologistId) => {
    dispatch(radiologistActions.updateDetail(formData, radiologistId))
  },
  detail: formData => {
    dispatch(radiologistActions.detail(formData))
  },
  hospitalListing: (formData) => {
    dispatch(hospitalActions.listing(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RadiologistFormPage)
