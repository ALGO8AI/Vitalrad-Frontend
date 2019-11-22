// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import idx from 'idx'
import {discrepancyActions} from '../../_actions'
import Moment from 'react-moment'
import {Modal} from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import ChatPage from './ChatPage'

type Props = {
  getDiscrepancy: Function,
  discrepancies: Array<any>,
}

type State = {
  showChat: boolean,
  discrepancyList: Array<any>,
  accessionNo: any,
  activeDisData: Object
};

class DiscrepancyList extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)

    this.state = {
      showChat: false,
      discrepancyList: [],
      accessionNo: '',
      activeDisData: null
    }
  }
  componentDidMount() {
    this.getDiscrepancyList()
  }
  
  getDiscrepancyList = () => {
    this.props.getDiscrepancy()
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.discrepancies) {
      this.setState({discrepancyList: nextProps.discrepancies})
    }
  }

  openChat = (e: any, disObj: Object) => {
    this.setState({showChat: !this.state.showChat, activeDisData: disObj})
  }

  handleClose = (e: any) => {
    this.setState({showChat: false, accessionNo: '', activeDisData: null})
  }

  render() {
    const {activeDisData} = this.state
    let discrepancyList = idx(this.state, _ => _.discrepancyList)
      ? this.state.discrepancyList
      : []
    let disRow = null
    disRow = discrepancyList.map((dis, index) => (
      <tr key={index}>
        <td><Moment format="Do MMMM YYYY">{dis.Scan_Received_Date}</Moment></td>
        <td>{dis.Reported_By}</td>
        <td data-tip data-for={'tip-'+dis.Accession_No}>{dis.Accession_No}
        <ReactTooltip id={'tip-'+dis.Accession_No} aria-haspopup='true' role='example'>
          <table>
            <tbody>
              <tr><td>Patients Name : {dis.Patient_First_Name}</td><td>Hospital Name : {dis.Hospital_Name}</td><td>Hospital Number : {dis.Hospital_Number}</td></tr>
              <tr><td>Scan Received Date : {dis.Scan_Received_Date}</td><td>Scan Received Time : {dis.Scan_Received_time}</td><td>Modality : {dis.Modality}</td></tr>
              <tr><td>Body Part : {dis.Body_Part}</td><td>Tat Status : {dis.TAT_Status}</td><td></td></tr>
              <tr><td>Audit Person : {dis.Audit_Person}</td><td>Audit Category : {dis.Audit_Category}</td><td></td></tr>
            </tbody>
          </table>
        </ReactTooltip>
        </td>
        <td>Appears to have used in ACC slice 354-{359 + index + 1}</td>
        <td>
          <div className="badge badge-success p-2" onClick={e => this.openChat(e, dis)}>Comment</div>
        </td>
      </tr>
    ))
    return (
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-sm-flex align-items-center mb-4">
                  <h4 className="card-title mb-sm-0">Discrepancy Dashboard</h4>
                </div>
                <div className="table-responsive border rounded p-1">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="font-weight-bold">Date</th>
                        <th className="font-weight-bold">Raised By</th>
                        <th className="font-weight-bold">Accession No.</th>
                        <th className="font-weight-bold">Discrepancy</th>
                        <th className="font-weight-bold"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {disRow}
                    </tbody>
                  </table>
                </div>
              </div>
              <Modal
                className="add-event"
                show={this.state.showChat}
                onHide={e => this.handleClose(e)}>
                <ChatPage activeDisData={activeDisData}/>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  discrepancies: state.discrepancy.detail || [],
})

const mapDispatchToProps = dispatch => ({
  getDiscrepancy: () => {
    dispatch(discrepancyActions.listing())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscrepancyList)