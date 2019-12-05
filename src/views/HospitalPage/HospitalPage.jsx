// @flow
import React from 'react'
import {Table, Button, Modal, Form} from 'react-bootstrap'
import {Icon} from 'react-icons-kit'
import {pencil, trashO, filter} from 'react-icons-kit/fa'
import {connect} from 'react-redux'
import Dialog from 'react-bootstrap-dialog'
import idx from 'idx'
import {hospitalActions} from '../../_actions'
import HospitalFormPage from './HospitalFormPage'

type Props = {
  hospitalListing: Function,
  deleteRecord: Function,
  hospitals: Array<any>,
  history: any,
  hospitalProcess: boolean,
  match: any,
}

type State = {
  hospitalList: Array<any>,
  hospitalId: string,
  showHospitalFrom: boolean,
}

export class HospitalPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hospitalId: '',
      hospitalList: [],
      showHospitalFrom: false,
    }
  }

  componentDidMount() {
    this.getHospitalListing()
  }

  getHospitalListing = () => {
    this.props.hospitalListing()
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.hospitals) {
      this.setState({hospitalList: nextProps.hospitals})
    }
    if (
      nextProps.hospitalProcess === false &&
      this.props.hospitalProcess !== nextProps.hospitalProcess
    ) {
      this.getHospitalListing()
    }
  }

  deleteHospital = (hospitalId: string) => {
    if (hospitalId) {
      this.props.deleteRecord(hospitalId)
      this.getHospitalListing()
    }
  }

  confirmDeleteHospital = (e: any, hospitalId: string) => {
    //$FlowFixMe
    this.dialog.show({
      title: 'Delete Hospital',
      body: 'Are you sure you want to delete this Hospital?',
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          this.deleteHospital(hospitalId)
        }),
      ],
      bsSize: 'small',
      onHide: dialog => {
        dialog.hide()
      },
    })
  }

  handleClose = (e: any) => {
    this.setState({showHospitalFrom: false, hospitalId: ''})
    this.getHospitalListing()
  }
  handleShow = (e: any, hospitalID: string) => {
    this.setState({showHospitalFrom: true, hospitalId: hospitalID})
  }

  // Search Filter
  filterHospital = (event: any) => {
    let regVal = /^[A-Za-z\d]+$/
    if (regVal.test(event.target.value) || event.target.value.length === 0) {
      let hospitalList = idx(this.props, _ => _.hospitals)
        ? this.props.hospitals
        : []
      hospitalList = hospitalList.filter(
        item =>
          item.name.toLowerCase().search(event.target.value.toLowerCase()) !==
            -1 ||
          item.description
            .toLowerCase()
            .search(event.target.value.toLowerCase()) !== -1
      )
      this.setState({hospitalList: hospitalList})
    }
  }

  render() {
    const {showHospitalFrom, hospitalId} = this.state
    let hospitalRow = null
    let hospitalList = idx(this.state, _ => _.hospitalList)
      ? this.state.hospitalList
      : []
    hospitalRow = hospitalList.map((hospital, index) => (
      <tr key={index}>
        <td className="name">
          <span className="name">{hospital.name}</span>
          <span className="detail">{hospital.description}</span>
        </td>
        <td className="actions">
          <Button onClick={e => this.handleShow(e, hospital._id)}>
            <Icon icon={pencil} />
          </Button>
          <Button onClick={e => this.confirmDeleteHospital(e, hospital._id)}>
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
          <h2>Hospital</h2>
          <div className="btn-container">
            <div className="filter">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search Hospital...."
                  onChange={e => this.filterHospital(e)}
                />
              </Form.Group>
              <Button className="btn-primary">
                <Icon icon={filter} />
              </Button>
            </div>
            <Button onClick={e => this.handleShow(e, '')}>
              Create Hospital
            </Button>
          </div>
        </div>
        <div className="listing-container">
          <Table className="responsive-grid">
            <thead>
              <tr>
                <th>Name</th>
                <th width="10%">Actions</th>
              </tr>
            </thead>
            <tbody>{hospitalRow}</tbody>
            {hospitalRow.length === 0 && (
              <tbody>
                <tr>
                  <td>No Records Found</td>
                  <td></td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
        <Modal
          className="add-hospital"
          show={showHospitalFrom}
          onHide={e => this.handleClose(e)}>
          <HospitalFormPage hospitalID={hospitalId} />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  hospitals: state.hospital.hospitals || [],
})

const mapDispatchToProps = dispatch => ({
  hospitalListing: () => {
    dispatch(hospitalActions.listing())
  },
  deleteRecord: hospitalId => {
    dispatch(hospitalActions.deleteRecord(hospitalId))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HospitalPage)
