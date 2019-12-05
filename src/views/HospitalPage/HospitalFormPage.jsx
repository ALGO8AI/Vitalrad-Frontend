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
  description: string,
  submitted: boolean,
  hospitalId: string,
  validation: Object,
}

const checklength = (checklength: string) => {
  return checklength.length > 10 ? false : true
}

const validator = new FormValidator([
  {
    field: 'name',
    method: 'isEmpty',
    validWhen: false,
    message: 'Name is required.',
  },
  {
    field: 'description',
    method: 'isEmpty',
    validWhen: false,
    message: 'Description is required.',
  },
  {
    field: 'description',
    method: checklength,
    validWhen: false,
    message: 'Description length must be at least 10 characters long.',
  },
])

export class HospitalFormPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      name: '',
      description: '',
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
      const {name, description, hospitalId} = this.state
      if (name && description) {
        let formData = {
          name: name,
          description: description,
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
      description: '',
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
        description: hospitalDetail.description,
      })
    }
  }

  render() {
    const {hospital, alert} = this.props
    let isProcessing =
      hospital && hospital.isProcessing ? hospital.isProcessing : false

    const {name, description, submitted, hospitalId} = this.state
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
                  className={
                    validation.description.isInvalid ? ' has-error' : ''
                  }>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows="3"
                    value={description}
                    onChange={e => this.handleChange(e)}
                  />
                  {validation.description.isInvalid && (
                    <div className="help-block">
                      {validation.description.message}
                    </div>
                  )}
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
