// @flow
import React from 'react'
import {Button, Form, Modal} from 'react-bootstrap'
import {connect} from 'react-redux'
import idx from 'idx'
import {modalityActions} from '../../_actions'
// import FormValidator from '../../_helpers/FormValidator'
// import {authDetail, loggedInUser} from '../../_helpers'
import {Icon} from 'react-icons-kit'
import {minusCircle, plusCircle} from 'react-icons-kit/fa'

type Props = {
  modalityObj: any,
  modalityID: string,
  updateDetail: Function,
  create: Function,
  alert: any,
}

type State = {
  submitted: boolean,
  modalityId: string,
  modalityObj: Object,
  validation: Object,
};

export class ModalityForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      submitted: false,
      modalityId: '',
      modalityList: {'modality': '', sub_modality: ['']},
    }
  }

  handleChange = (e: any, subIndex:any) => {
    const {name, value} = e.target
    let stateClone = JSON.parse(JSON.stringify(this.state.modalityList));
    if(name === 'name'){
      stateClone.modality = value
    }
    if(name === 'sub_modality'){
      stateClone.sub_modality[subIndex] = value
    }
    this.setState({modalityList: stateClone})
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    this.setState({submitted: true})
    const {modalityList, modalityId} = this.state
    if (modalityList.modality !== '') {
      let formData = {
        modality: modalityList.modality,
        sub_modality: modalityList.sub_modality,
      }
      if (modalityId && modalityId !== '') {
        formData._id = modalityId
        this.props.updateDetail(formData, modalityId)
      } else {
        this.props.create(formData)
         setTimeout(() => this.clearState(), 3000);
      }
    } else {
      this.setState({
        submitted: false,
      })
    }
  }

  clearState = () => {
    this.setState({
      modalityList: {'modality': '', sub_modality: ['']},
      modalityId: '',
      submitted: false,
    })
  }

  componentDidMount() {
    console.log('props', this.props.modalityObj)
    const {modalityObj} = this.props
    if (idx(modalityObj, _ => _._id)) {
      this.setState({modalityId: modalityObj._id, modalityList:{modality: modalityObj.modality, sub_modality: modalityObj.sub_modality}})
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.hospitals) {
      this.setState({hospitalList: nextProps.hospitals})
    }
    if (nextProps.auditfilters && this.state.auditfilters !== nextProps.auditfilters ) {
      this.setState({auditfilters: nextProps.auditfilters})
    }
    //set data
    if (
      this.state.doctorId !== '' &&
      idx(nextProps, _ => _.doctor.doctorDetail._id) &&
      !nextProps.doctor.isProcessing
    ) {
      let {doctorDetail} = nextProps.doctor
      let profileData = (idx(doctorDetail, _ => _.profile.name)) ? doctorDetail.profile : {} 
      this.setState({
        name: profileData.name,
        address: profileData.address,
        code: profileData.code || '',
        username: doctorDetail.username,
        email: profileData.email || '',
        mobile: profileData.mobile || '',
        hospitalId: profileData.hospital_id,
      })
    }

    if (this.state.doctorId === '' && idx(nextProps, _ => _.doctor.doctor._id)) {
      this.clearState()
    }
  }

  customModalityRow = (options) => {
    console.log('options', options)
    const listItems = options.map((cusRow, index) =>
      <div className="row" key={index}>
        <div className="col-md-10">
          <Form.Group>
            <Form.Control
              type="text"
              name="sub_modality"
              value={cusRow}
              onChange={e => this.handleChange(e, index)}>
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-2">
          {(index !== 0) ? <Icon icon={minusCircle} onClick={(e) => this.handleDelete(index, e)} /> : ''}
        </div>
      </div>
    );
    return (
      listItems
    )
  }

  handleDelete = (index, e) => {
    let stateClone = JSON.parse(JSON.stringify(this.state.modalityList));
    stateClone.sub_modality.splice(index, 1);
    this.setState({ modalityList: stateClone });
    e.preventDefault();
  }

  handleClick = (e) => {
    const {modalityList} = this.state
    modalityList.sub_modality.push('');
    this.setState({ modalityList: modalityList});
    e.preventDefault();
  }

  render() {
    const {alert} = this.props
    const {isProcessing} = this.props.doctor || false
    const {modalityList, modalityId} = this.state
    const subModalities = modalityList.sub_modality || []

    return (
      <div>
        <Modal.Header closeButton>
          <Modal.Title>{modalityId ? 'Edit' : 'Add'} Modality</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert && alert.message && (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          )}
          <div className="hospital-detail">
            <div className="create-container">
              <Form name="form" onSubmit={e => this.handleSubmit(e)}>
                <Form.Group>
                  <Form.Label>Modality Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    readOnly={modalityId ? true: false}
                    value={modalityList.modality}
                    onChange={e => this.handleChange(e)}>
                  </Form.Control>
                </Form.Group>
                <React.Fragment><hr style={{height: 3}}/>
                <div className="row">
                  <div className="col-md-10">
                      <Form.Label style={{'fontSize':'0.875rem', 'marginBottom': '0px !important'}}>Sub Modality</Form.Label>
                  </div>
                  <div className="col-md-2" style={{'marginBottom': '5px !important'}}>
                    <div style={{'marginBottom': '5px !important'}}>
                      <Icon icon={plusCircle} onClick={this.handleClick}/>
                    </div>
                  </div>
                </div>
                {this.customModalityRow(subModalities)}
              </React.Fragment>
                <Button type="submit" className="btn btn-primary">
                  {modalityId ? 'Update' : 'Create'}
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
  auditfilters: state.audit.auditfilters || [],
  doctor: state.doctor,
  hospitals: state.hospital.detail || [],
  alert: state.alert || false,
})

const mapDispatchToProps = dispatch => ({
  create: formData => {
    dispatch(modalityActions.create(formData))
  },
  updateDetail: formData => {
    dispatch(modalityActions.updateDetail(formData))
  },
  getModalities: (formData) => {
    dispatch(modalityActions.getModalities(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalityForm)
