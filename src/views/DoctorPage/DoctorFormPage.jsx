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
  listing: Function,
  create: Function,
  detail: Function,
  alert: any,
}

type State = {
  name: string,
  description: string,
  submitted: boolean,
  hospitalId: string,
  doctorId: string,
  hospitalList: any,
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
      description: '',
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
      const {name, description, hospitalId, doctorId} = this.state
      if (name && description && hospitalId) {
        let formData = {
          name: name,
          description: description,
          hospitals: [hospitalId],
        }
        if (doctorId && doctorId !== '') {
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
      description: '',
      hospitalId: '',
      submitted: false,
      validation: validator.valid(),
    })
  }

  componentDidMount() {
    if (this.state.hospitalList.length === 0) {
      this.props.listing()
    }
    //edit - get data
    if (this.props.doctorID && this.props.doctorID !== '') {
      const {doctorID} = this.props
      if (doctorID) {
        this.setState({doctorId: doctorID})
        this.props.detail(doctorID)
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
      let tmpHospitalId = idx(doctorDetail, _ => _.hospitals[0].hospitalId._id)
        ? doctorDetail.hospitals[0].hospitalId._id
        : doctorDetail.hospitals[0].hospitalId
      this.setState({
        name: doctorDetail.name,
        description: doctorDetail.description,
        hospitalId: tmpHospitalId,
      })
    }

    if (this.state.doctorId === '' && idx(nextProps, _ => _.doctor.doctor._id)) {
      this.clearState()
    }
  }

  render() {
    const {alert} = this.props
    const {isProcessing} = this.props.doctor || false
    const {name, description, submitted, hospitalId, doctorId} = this.state
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
        {hospital.name}
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
  hospitals: state.hospital.hospitals || [],
  alert: state.alert || false,
})

const mapDispatchToProps = dispatch => ({
  create: formData => {
    dispatch(doctorActions.create(formData))
  },
  updateDetail: (formData, doctorId) => {
    dispatch(doctorActions.updateDetail(formData, doctorId))
  },
  detail: doctorId => {
    dispatch(doctorActions.detail(doctorId))
  },
  listing: () => {
    dispatch(hospitalActions.listing())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoctorFormPage)
