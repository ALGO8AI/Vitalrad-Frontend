// @flow
import React from 'react'
import {Table, Modal} from 'react-bootstrap'
import {connect} from 'react-redux'
import Dialog from 'react-bootstrap-dialog'
import idx from 'idx'
import {doctorActions} from '../../_actions'
import DoctorIdForm from './DoctorIdForm'

type Props = {
  getDoctorsWithNullIds: Function,
  updateDocId: Function,
  doctors: Array<any>,
  history: any,
  doctorProcess: boolean,
  match: any,
}

type State = {
  doctorList: Array<any>,
  doctorObj: Object,
  firstname: string,
  lastname: string,
  showDoctorIdFrom: boolean,
};

export class DoctorList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      firstname: '',
      lastname: '',
      doctorObj: {},
      doctorList: [],
      showDoctorIdFrom: false,
    }
  }

  componentDidMount() {
    this.props.getDoctorsWithNullIds()
  }


  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.doctors) {
      this.setState({doctorList: nextProps.doctors})
    }
  }

  getNameDetail = (firstname: string, lastname: string) => {
    this.setState({firstname: firstname, lastname: lastname});
    this.confirmGenerateId();
    // this.generateID(firstname, lastname);
  }

  generateID = () => {
    const {doctorObj, firstname, lastname} = this.state;
    if (doctorObj && doctorObj.Hospital_Name !=='') {
      let formData = {
        "hospital_name": doctorObj.Hospital_Name,
        "firstname": firstname ,
        lastname: lastname,
        "hospital_number": doctorObj.Hospital_Number 
      }
      this.props.updateDocId(formData)
      setTimeout(() => {
        // this.props.getDoctorsWithNullIds()
        // window.location.reload();
      }, 1000);
    }
  }

  confirmGenerateId = () => {
    //$FlowFixMe
    this.dialog.show({
      title: 'Generate Doctor\'s ID',
      body: 'Are you sure you want to generate ID for this Doctor?',
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          this.generateID()
        }),
      ],
      bsSize: 'small',
      onHide: dialog => {
        dialog.hide()
      },
    })
  }

  handleClose = (e: any) => {
    this.setState({showDoctorIdFrom: false, firstname: '', lastname: '', doctorObj: {}})
  }
  handleShow = (e: any, doctor: object) => {
    this.setState({showDoctorIdFrom: true, firstname: '', lastname: '', doctorObj: doctor})
  }

  render() {
    const { showDoctorIdFrom } = this.state;
    let doctorRow = null
    let doctorList = idx(this.state, _ => _.doctorList)
      ? this.state.doctorList
      : []
    doctorRow = doctorList.map((doctor, index) => (
      <tr key={index}>
        <td className="doctorname">
          <span className="name">{doctor.Referred_By}</span>
        </td>
        <td className="doctorname">{doctor.Accession_No ? doctor.Accession_No : ''}</td>
        <td className="doctorname">{doctor.Hospital_Name ? doctor.Hospital_Name : ''}</td>
        <td className="doctorname">{doctor.Hospital_Number ? doctor.Hospital_Number : ''}</td>
        <td className="actions">
          <span className="name" style={{cursor: 'pointer'}} onClick={e => this.handleShow(e, doctor)}>Generate ID</span>
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
              <h4>Doctors</h4>
            </div>
            <div className="listing-container">
              <Table className="responsive-grid">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Accession No</th>
                    <th>Hospital Name</th>
                    <th>Hospital Number</th>
                    <th width="10%">Actions</th>
                  </tr>
                </thead>
                <tbody>{doctorRow}</tbody>
                {doctorRow.length === 0 && (
                  <tbody>
                    <tr>
                      <td colSpan="5">No Records Found</td>
                    </tr>
                  </tbody>
                )}
              </Table>
              <Modal
                backdrop="static"
                className="add-doctor"
                show={showDoctorIdFrom}
                onHide={e => this.handleClose(e)}>
                <DoctorIdForm getNameDetail={this.getNameDetail} />
              </Modal>
            </div>
          </div> 
        </div> 
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    doctors: state.doctor.detail || [],
  }
}

const mapDispatchToProps = dispatch => ({
  getDoctorsWithNullIds: () => {
    dispatch(doctorActions.getDoctorsWithNullIds())
  },
  updateDocId: formData => {
    dispatch(doctorActions.updateDocId(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoctorList)
