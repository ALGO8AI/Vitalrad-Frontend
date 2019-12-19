// @flow
import React from 'react'
import {Button, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import idx from 'idx'
import {hospitalActions} from '../../_actions'
import FormValidator from '../../_helpers/FormValidator'
import {authDetail, loggedInUser} from '../../_helpers'

type Props = {
  userData: any,
  match: any,
  updateDetail: Function,
  detail: Function,
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
  loggedInUser: string
};

const checkPassword = (password: string, state: Object) => {
  if (state.userId !== '' && password.length === 0) {
    return false
  } else if (state.userId !== '' && password.length > 5) {
    return false
  } else if (state.userId === '' && password.length > 5) {
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
    field: 'password',
    method: checkPassword,
    validWhen: false,
    message: 'Password length must be at least 3 characters long.',
  },
])

export class AccountPage extends React.Component<Props, State> {
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
      userId: '',
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
      const {loggedInUser, name, code, username, password, email, mobile, address, userId} = this.state
      if (name && code) {
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
        this.props.detail(formData)
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

    //set data
    if (
      this.state.userId !== '' &&
      idx(nextProps, _ => _.userData._id) &&
      !nextProps.userData.isProcessing
    ) {
      let {userData} = nextProps
      this.setState({
        name: userData.profile.name || '',
        code: userData.profile.code || '',
        username: userData.username,
        email: userData.profile.email || '',
        mobile: userData.profile.mobile || '',
        address: userData.profile.address || '',
      })
    }
  }

  render() {
    const {userData, alert} = this.props
    let isProcessing =
      userData && userData.isProcessing ? userData.isProcessing : false

    const {name, code, username, password, mobile, email, address, submitted, userId} = this.state
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
                  <div className="create-container">
                    <Form name="form" onSubmit={e => this.handleSubmit(e)}>
                      <Form.Group
                        className={validation.name.isInvalid ? ' has-error' : ''}>
                        <Form.Label>Name</Form.Label>
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
                      <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={username}
                          disabled={true}
                        />
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
                        {userId ? 'Update' : 'Create'}
                      </Button>
                      {isProcessing && <div className="loader"></div>}
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userData: state.hospital.hospitalDetail || null,
  alert: state.alert || false,
})

const mapDispatchToProps = dispatch => ({
  create: formData => {
    dispatch(hospitalActions.create(formData))
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
