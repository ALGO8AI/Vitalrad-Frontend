// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import idx from 'idx'
import {discrepancyActions} from '../../_actions'
import Moment from 'react-moment'
import {Modal} from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'

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

  handleNewUserMessage = (newMessage) => {
    // this.inputElement.click();
    // Now send the message throught the backend API
  }

  openChat = (e: any, disObj: Object) => {
    this.setState({showChat: !this.state.showChat, activeDisData: disObj})
  }

  handleClose = (e: any) => {
    this.setState({showChat: false, accessionNo: '', activeDisData: null})
  }

  sendChat = (e: any) =>{
    if(e.keyCode === 13 || e.key === 'Enter'){
      console.log('value', e.target.value);
    }
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
             <tr><td>Patients Name : {dis.Patient_First_Name}</td><td>Hospital Name : {dis.Hospital_Name}</td><td>Hospital Number : {dis.Hospital_Number}</td></tr>
             <tr><td>Scan Received Date : {dis.Scan_Received_Date}</td><td>Scan Received Time : {dis.Scan_Received_time}</td><td>Modality : {dis.Modality}</td></tr>
             <tr><td>Body Part : {dis.Body_Part}</td><td>Tat Status : {dis.TAT_Status}</td><td></td></tr>
             <tr><td>Audit Person : {dis.Audit_Person}</td><td>Audit Category : {dis.Audit_Category}</td><td></td></tr>
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
                <div className="card chat-room small-chat wide" id="myForm">
                  <div className="card-header white d-flex justify-content-between p-2" id="toggle" >
                    <div className="heading d-flex justify-content-start">
                      <div className="profile-photo">
                        <span className="state"></span>
                      </div>
                      <div className="data">
                        <p className="name mb-0"><strong>Accession No : - {activeDisData && activeDisData.Accession_No}</strong></p>
                        <p className="activity text-muted mb-0">Active now</p>
                      </div>
                    </div>
                  </div>
                  <div className="my-custom-scrollbar" id="message">
                    <div className="card-body p-3">
                      <div className="chat-message">
                        <div className="d-flex w-75  justify-content-start">
                          <div className="card bg-light rounded w-75 z-depth-0 mb-2">
                            <div className="card-body p-2">
                              <p className="card-text black-text">Qui animi molestiae autem nihil optio recusandae nisi sit ab quo est.</p>
                            </div>
                          </div>
                        </div>
                        <div className="card bg-primary rounded w-75 float-right z-depth-0 mb-1">
                          <div className="card-body p-2">
                            <p className="card-text text-white">Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur adipisicing elit voluptatem cum eum tempore.</p>
                          </div>
                        </div>
                        <div className="d-flex w-75  justify-content-start">
                          <div className="card bg-light rounded w-75 z-depth-0 mb-2">
                            <div className="card-body p-2">
                              <p className="card-text black-text">Qui animi molestiae autem nihil optio recusandae nisi sit ab quo est.</p>
                            </div>
                          </div>
                        </div>
                        <div className="card bg-primary rounded w-75 float-right z-depth-0 mb-2">
                          <div className="card-body p-2">
                            <p className="card-text text-white">Rem suscipit lorum repellendus ditiis?</p>
                          </div>
                        </div>
                        <div className="d-flex w-75  justify-content-start">
                          <div className="card bg-light rounded w-75 z-depth-0 mb-2">
                            <div className="card-body p-2">
                              <p className="card-text black-text">Qui animi molestiae autem nihil optio recusandae nisi sit ab quo est.</p>
                            </div>
                          </div>
                        </div>
                        <div className="card bg-primary rounded w-75 float-right z-depth-0 mb-1 last">
                          <div className="card-body p-2">
                            <p className="card-text text-white">Maxime nostrum ut blanditiis a quod quam, quidem deleniti?</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer text-muted white pt-1 pb-2 px-3">
                    <input type="text" id="exampleForm2" className="form-control" placeholder="Type a message..." onKeyDown={e => this.sendChat(e)} />
                  </div>
                </div>
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