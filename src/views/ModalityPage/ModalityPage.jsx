// @flow
import React from 'react'
import {Table, Button, Modal} from 'react-bootstrap'
import {Icon} from 'react-icons-kit'
import {trashO} from 'react-icons-kit/fa'
import {connect} from 'react-redux'
import Dialog from 'react-bootstrap-dialog'
import idx from 'idx'
import {modalityActions} from '../../_actions'
import ModalityForm from './ModalityForm'
// import {authDetail, loggedInUser} from '../../_helpers'

type Props = {
  getModalities: Function,
  sub_modality: Array<any>,
  modalityList: Array<any>,
  modality: any,
  modalityProcess: boolean,
  match: any,
}

type State = {
  sub_modality: Array<any>,
  modalityList: Array<any>,
  modalityId: string,
  modality: string,
  showModalityFrom: boolean,
};

export class ModalityPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      modalityId: '',
      modality: '',
      modalityList: [],
      showModalityFrom: false,
    }
  }

  componentDidMount() {
    this.getModalityListing()
  }

  getModalityListing = () => {
    this.props.getModalities({})
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (idx(nextProps, _ => _.modality.detail) && Array.isArray(nextProps.modality.detail)) {
      this.setState({modalityList: nextProps.modality.detail})
    }
    if (
      nextProps.modalityProcess === false &&
      this.props.modalityProcess !== nextProps.modalityProcess
    ) {
      this.getModalityListing()
    }
  }


  handleClose = (e: any) => {
    this.setState({showModalityFrom: false, modalityId: ''})
    this.getModalityListing()
  }
  handleShow = (e: any, modalityID: string) => {
    this.setState({showModalityFrom: true, modalityId: modalityID})
  }

  deleteModality = (modalityName: string) => {
    if (modalityName) {
      let formData = {
        "modality" :modalityName
      }
      this.props.deleteRecord(formData)
      setTimeout(() => {
        this.getModalityListing()
      }, 500);
    }
  }

  confirmDeleteModality = (e: any, modalityName: string) => {
    //$FlowFixMe
    this.dialog.show({
      title: 'Delete Modality',
      body: 'Are you sure you want to delete this Modality?',
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          this.deleteModality(modalityName)
        }),
      ],
      bsSize: 'small',
      onHide: dialog => {
        dialog.hide()
      },
    })
  }

  render() {
    const {showModalityFrom, modalityId} = this.state
    let modalityRow = null
    let modalityList = idx(this.state, _ => _.modalityList)
      ? this.state.modalityList
      : []
    modalityRow = modalityList.map((modality, index) => (
      <tr key={index}>
        <td className="modalityname">
          <span className="name">{modality.modality}</span>
        </td>
        <td className="modalityname">{modality.sub_modality.join(', ')}</td>
        <td className="actions">
          {/*<Button onClick={e => this.handleShow(e, modality._id)}>
            <Icon icon={pencil} />
          </Button>*/}
          <Button onClick={e => this.confirmDeleteModality(e, modality.modality)}>
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
              <h4>Modality</h4>
              <div className="btn-container">
                <div className="filter">
                  {/*<Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Search Modality...."
                      onChange={e => this.filterModality(e)}
                    />
                  </Form.Group>
                  <Button className="btn-primary">
                    <Icon icon={filter} />
                  </Button>*/}
                </div>
                <Button onClick={e => this.handleShow(e, '')}>Create Modality</Button>
              </div>
            </div>
            <div className="listing-container">
              <Table className="responsive-grid">
                <thead>
                  <tr>
                    <th>Modality</th>
                    <th>Sub Modality</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{modalityRow}</tbody>
                {modalityRow.length === 0 && (
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
          backdrop="static"
          className="add-modality"
          show={showModalityFrom}
          onHide={e => this.handleClose(e)}>
          <ModalityForm modalityID={modalityId} />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  modality: state.modality || null,
})

const mapDispatchToProps = dispatch => ({
  getModalities: (formData) => {
    dispatch(modalityActions.getModalities(formData))
  },
  deleteRecord: formData => {
    dispatch(modalityActions.deleteRecord(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalityPage)
