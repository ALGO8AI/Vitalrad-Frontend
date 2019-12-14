// @flow
import React from 'react'
import {Table, Button, Modal, Form} from 'react-bootstrap'
import {Icon} from 'react-icons-kit'
import {pencil, trashO, filter} from 'react-icons-kit/fa'
import {connect} from 'react-redux'
import Dialog from 'react-bootstrap-dialog'
import idx from 'idx'
import {radiologistActions} from '../../_actions'
import RadiologistFormPage from './RadiologistFormPage'

type Props = {
  radiologistListing: Function,
  deleteRecord: Function,
  radiologists: Array<any>,
  history: any,
  radiologistProcess: boolean,
  match: any,
}

type State = {
  radiologistList: Array<any>,
  radiologistId: string,
  showRadiologistFrom: boolean,
};

export class RadiologistPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      radiologistId: '',
      radiologistList: [],
      showRadiologistFrom: false,
    }
  }

  componentDidMount() {
    this.getRadiologistListing()
  }

  getRadiologistListing = () => {
    this.props.radiologistListing({"user_type": "radiologist"})
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.radiologists) {
      this.setState({radiologistList: nextProps.radiologists})
    }
    if (
      nextProps.radiologistProcess === false &&
      this.props.radiologistProcess !== nextProps.radiologistProcess
    ) {
      this.getRadiologistListing()
    }
  }

  deleteRadiologist = (radiologistId: string) => {
    if (radiologistId) {
      let formData = {
        "_id" :radiologistId,
        "deleted": true
      }
      this.props.deleteRecord(formData)
      setTimeout(() => {
        this.getRadiologistListing()
      }, 500);
    }
  }

  confirmDeleteRadiologist = (e: any, radiologistId: string) => {
    //$FlowFixMe
    this.dialog.show({
      title: 'Delete Radiologist',
      body: 'Are you sure you want to delete this Radiologist?',
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          this.deleteRadiologist(radiologistId)
        }),
      ],
      bsSize: 'small',
      onHide: dialog => {
        dialog.hide()
      },
    })
  }

  handleClose = (e: any) => {
    this.setState({showRadiologistFrom: false, radiologistId: ''})
    this.getRadiologistListing()
  }
  handleShow = (e: any, radiologistID: string) => {
    this.setState({showRadiologistFrom: true, radiologistId: radiologistID})
  }

  // Search Filter
  filterRadiologist = (event: any) => {
    let regVal = /^[A-Za-z\d]+$/
    if (regVal.test(event.target.value) || event.target.value.length === 0) {
      let radiologistList = idx(this.props, _ => _.radiologists)
        ? this.props.radiologists
        : []
      radiologistList = radiologistList.filter(
        item =>
          item.profile.name.toLowerCase().search(event.target.value.toLowerCase()) !==
            -1 ||
          item.username
            .toLowerCase()
            .search(event.target.value.toLowerCase()) !== -1
      )
      this.setState({radiologistList: radiologistList})
    }
  }

  render() {
    const {showRadiologistFrom, radiologistId} = this.state
    let radiologistRow = null
    let radiologistList = idx(this.state, _ => _.radiologistList)
      ? this.state.radiologistList
      : []
    radiologistRow = radiologistList.map((radiologist, index) => (
      <tr key={index}>
        <td className="radiologistname">
          <span className="name">{radiologist.username}</span>
        </td>
        <td className="radiologistname">{radiologist.profile.name}</td>
        <td className="radiologistname">{radiologist.profile.code}</td>
        <td className="radiologistname">{radiologist.status}</td>
        <td className="actions">
          <Button onClick={e => this.handleShow(e, radiologist._id)}>
            <Icon icon={pencil} />
          </Button>
          <Button onClick={e => this.confirmDeleteRadiologist(e, radiologist._id)}>
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
            <h2>Radiologist</h2>
            <div className="btn-container">
              <div className="filter">
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Search Radiologist...."
                    onChange={e => this.filterRadiologist(e)}
                  />
                </Form.Group>
                <Button className="btn-primary">
                  <Icon icon={filter} />
                </Button>
              </div>
              <Button onClick={e => this.handleShow(e, '')}>
                Create Radiologist
              </Button>
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
              <tbody>{radiologistRow}</tbody>
              {radiologistRow.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan="5">No Records Found</td>
                  </tr>
                </tbody>
              )}
            </Table>
          </div>
        </div>
      </div>
        <Modal
          className="add-radiologist"
          show={showRadiologistFrom}
          onHide={e => this.handleClose(e)}>
          <RadiologistFormPage radiologistID={radiologistId} />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  radiologists: state.radiologist.detail || [],
})

const mapDispatchToProps = dispatch => ({
  radiologistListing: (formData) => {
    dispatch(radiologistActions.listing(formData))
  },
  deleteRecord: formData => {
    dispatch(radiologistActions.deleteRecord(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RadiologistPage)
