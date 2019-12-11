// @flow
import React from 'react'
import {Button, Form, Modal} from 'react-bootstrap'
import {connect} from 'react-redux'
import idx from 'idx'
import {hospitalActions} from '../../_actions'
import FormValidator from '../../_helpers/FormValidator'

type Props = {
  hospital: any,
  hospitalID: string,
  updateDetail: Function,
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
  validation: Object,
};

const checklength = (checklength: string) => {
  return checklength.length > 3 ? false : true
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
    method: 'isEmpty',
    validWhen: false,
    message: 'Password is required.',
  },
  {
    field: 'password',
    method: checklength,
    validWhen: false,
    message: 'Password length must be at least 3 characters long.',
  },
])

export class HospitalFormPage extends React.Component<Props, State> {
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
      hospitalId: '',
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
      const {name, code, username, password, email, mobile, address, hospitalId} = this.state
      if (name && code) {
        let formData = {
          name: name,
          code: code,
          username: username,
          password: password,
          email: email,
          mobile: mobile,
          address : address,
          user_type: 'hospital',
          // status:'active'
        }
        if (hospitalId && hospitalId !== '') {
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
      address: '',
      submitted: false,
      validation: validator.valid(),
    })
  }

  componentDidMount() {
    //edit - get data
    if (this.props.hospitalID && this.props.hospitalID !== '') {
      const {hospitalID} = this.props
      if (hospitalID) {
        this.setState({hospitalId: hospitalID})
        this.props.detail(hospitalID)
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      idx(nextProps, _ => _.hospital.hospital._id) &&
      this.state.hospitalId === ''
    ) {
      this.clearState()
    }
    if (
      idx(nextProps, _ => _.hospital.isProcessing) &&
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
      this.setState({
        name: hospitalDetail.name,
        code: hospitalDetail.code,
        username: hospitalDetail.username,
        email: hospitalDetail.email,
        mobile: hospitalDetail.mobile,
        address: hospitalDetail.address,
      })
    }
  }

  render() {
    const {hospital, alert} = this.props
    let isProcessing =
      hospital && hospital.isProcessing ? hospital.isProcessing : false

    const {name, code, username, password, mobile, email, address, submitted, hospitalId} = this.state
    let validation
    validation = submitted // if the form has been submitted at least once
      ? validator.validate(this.state) // then check validity every time we render
      : this.state.validation // otherwise just use what's in state

    return (
      <div>
        <Modal.Header closeButton>
          <Modal.Title>{hospitalId ? 'Edit' : 'Create'} Hospital</Modal.Title>
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
                  <Form.Label>Hospital Name</Form.Label>
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
                    type="text"
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
                  {hospitalId ? 'Update' : 'Create'}
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
  hospital: state.hospital,
  alert: state.alert || false,
})

const mapDispatchToProps = dispatch => ({
  create: formData => {
    dispatch(hospitalActions.create(formData))
  },
  updateDetail: (formData, hospitalId) => {
    dispatch(hospitalActions.updateDetail(formData, hospitalId))
  },
  detail: hospitalId => {
    dispatch(hospitalActions.detail(hospitalId))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HospitalFormPage)
