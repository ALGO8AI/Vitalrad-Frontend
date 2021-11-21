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
import {authDetail, loggedInUser} from '../../_helpers'

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
    let hospitalName = null
    let formData = {"user_type": "doctor"}
    if(loggedInUser() === 'hospital'){
      let authData = authDetail()
      hospitalName = idx(authData, _ => _.detail.profile.name) ? authData.detail.profile.name : null
      if(hospitalName){
        formData.hospital_name = hospitalName
      }
    }
    this.props.doctorListing(formData)
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
      title: 'Delete User',
      body: 'Are you sure you want to delete this User?',
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
    let regVal = /^[A-Za-z\d\-_\s]+$/i
    if (regVal.test(event.target.value) || event.target.value.length === 0) {
      let doctorList = idx(this.props, _ => _.doctors)
        ? this.props.doctors
        : []
      doctorList = doctorList.filter(
        item =>
          item.profile.name.toLowerCase().search(event.target.value.toLowerCase()) !==
            -1 ||
          item.username.toLowerCase().search(event.target.value.toLowerCase()) !== -1 ||
          item.profile.mobile.toLowerCase().search(event.target.value.toLowerCase()) !== -1
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
        <td className="doctorname">{doctor.profile ? doctor.profile.name : ''}</td>
        <td className="doctorname">{doctor.profile ? doctor.profile.mobile : ''}</td>
        {/*<td className="doctorname">{doctor.status}</td>*/}
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
        <div className="card">
          <div className="card-body">
            <div className="heading">
              <h4>Users</h4>
              <div className="btn-container">
                <div className="filter">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Search Users...."
                      onChange={e => this.filterDoctor(e)}
                    />
                  </Form.Group>
                  <Button className="btn-primary">
                    <Icon icon={filter} />
                  </Button>
                </div>
                <Button onClick={e => this.handleShow(e, '')}>Create User</Button>
              </div>
            </div>
            <div className="listing-container">
              <Table className="responsive-grid table table-hover">
                <thead>
                  <tr>
                    <th className="font-weight-bold">Username</th>
                    <th className="font-weight-bold">Name</th>
                    <th className="font-weight-bold">Mobile</th>
                    {/*<th>Status</th>*/}
                    <th width="10%" className="font-weight-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>{doctorRow}</tbody>
                {doctorRow.length === 0 && (
                  <tbody>
                    <tr>
                      <td colSpan="5" style={{
                        textAlign:"center"
                      }}>No Records Found...</td>
                    </tr>
                  </tbody>
                )}
              </Table>
            </div>
          </div> 
        </div> 
        <Modal
          backdrop="static"
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
