// @flow
import React from 'react'
import {Table, Button, Modal, Form} from 'react-bootstrap'
import {Icon} from 'react-icons-kit'
import {pencil, trashO, filter} from 'react-icons-kit/fa'
import {connect} from 'react-redux'
import Dialog from 'react-bootstrap-dialog'
import idx from 'idx'
import {doctorActions} from '../../_actions'
import DoctorFormPage from './DoctorFormPage'

type Props = {
  doctorListing: Function,
  deleteRecord: Function,
  doctors: Array<any>,
  history: any,
  doctorProcess: boolean,
  match: any,
}

type State = {
  doctorList: Array<any>,
  doctorId: string,
  showDoctorFrom: boolean,
};

export class DoctorPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      doctorId: '',
      doctorList: [],
      showDoctorFrom: false,
    }
  }

  componentDidMount() {
    this.getDoctorListing()
  }

  getDoctorListing = () => {
    this.props.doctorListing({"user_type": "doctor"})
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.doctors) {
      this.setState({doctorList: nextProps.doctors})
    }
    if (
      nextProps.doctorProcess === false &&
      this.props.doctorProcess !== nextProps.doctorProcess
    ) {
      this.getDoctorListing()
    }
  }

  deleteDoctor = (doctorId: string) => {
    if (doctorId) {
      let formData = {
        "_id" :doctorId,
        "deleted": true
      }
      this.props.deleteRecord(formData)
      setTimeout(() => {
        this.getDoctorListing()
      }, 500);
    }
  }

  confirmDeleteDoctor = (e: any, doctorId: string) => {
    //$FlowFixMe
    this.dialog.show({
      title: 'Delete Doctor',
      body: 'Are you sure you want to delete this Doctor?',
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          this.deleteDoctor(doctorId)
        }),
      ],
      bsSize: 'small',
      onHide: dialog => {
        dialog.hide()
      },
    })
  }

  handleClose = (e: any) => {
    this.setState({showDoctorFrom: false, doctorId: ''})
    this.getDoctorListing()
  }
  handleShow = (e: any, doctorID: string) => {
    this.setState({showDoctorFrom: true, doctorId: doctorID})
  }

  // Search Filter
  filterDoctor = (event: any) => {
    let regVal = /^[A-Za-z\d]+$/
    if (regVal.test(event.target.value) || event.target.value.length === 0) {
      let doctorList = idx(this.props, _ => _.doctors)
        ? this.props.doctors
        : []
      doctorList = doctorList.filter(
        item =>
          item.profile.name.toLowerCase().search(event.target.value.toLowerCase()) !==
            -1 ||
          item.username
            .toLowerCase()
            .search(event.target.value.toLowerCase()) !== -1
      )
      this.setState({doctorList: doctorList})
    }
  }

  render() {
    const {showDoctorFrom, doctorId} = this.state
    let doctorRow = null
    let doctorList = idx(this.state, _ => _.doctorList)
      ? this.state.doctorList
      : []
    doctorRow = doctorList.map((doctor, index) => (
      <tr key={index}>
        <td className="doctorname">
          <span className="name">{doctor.username}</span>
        </td>
        <td className="doctorname">{doctor.profile.name}</td>
        <td className="doctorname">{doctor.profile.code}</td>
        <td className="doctorname">{doctor.status}</td>
        <td className="actions">
          <Button onClick={e => this.handleShow(e, doctor._id)}>
            <Icon icon={pencil} />
          </Button>
          <Button onClick={e => this.confirmDeleteDoctor(e, doctor._id)}>
            <Icon icon={trashO} />
          </Button>
        </td>
      </tr>
    ))
    return (
      <div className="content-wrapper">
        <Dialog
          ref={el => {
            //$FlowFixMe
            this.dialog = el
          }}
        />
        <div className="heading">
          <h2>Doctors</h2>
          <div className="btn-container">
            <div className="filter">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search Doctors...."
                  onChange={e => this.filterDoctor(e)}
                />
              </Form.Group>
              <Button className="btn-primary">
                <Icon icon={filter} />
              </Button>
            </div>
            <Button onClick={e => this.handleShow(e, '')}>Create Doctor</Button>
          </div>
        </div>
        <div className="listing-container">
          <Table className="responsive-grid">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Code</th>
                <th>Status</th>
                <th width="10%">Actions</th>
              </tr>
            </thead>
            <tbody>{doctorRow}</tbody>
          </Table>
        </div>
        <Modal
          className="add-doctor"
          show={showDoctorFrom}
          onHide={e => this.handleClose(e)}>
          <DoctorFormPage doctorID={doctorId} />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  doctors: state.doctor.detail || [],
})

const mapDispatchToProps = dispatch => ({
  doctorListing: (formData) => {
    dispatch(doctorActions.listing(formData))
  },
  deleteRecord: formData => {
    dispatch(doctorActions.deleteRecord(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoctorPage)
