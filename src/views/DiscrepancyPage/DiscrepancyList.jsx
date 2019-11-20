// @flow
import React from 'react'
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import idx from 'idx'
import {discrepancyActions} from '../../_actions'
import chat from '../../img/chat.png'
import Moment from 'react-moment'

type Props = {
  getDiscrepancy: Function,
  discrepancies: Array<any>,
}

type State = {
  showChat: boolean,
  discrepancyList: Array<any>
};

class DiscrepancyList extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)

    this.state = {
      showChat: false,
      discrepancyList: []
    }
  }
  componentDidMount() {
    this.getDiscrepancyList()
    // addResponseMessage("Welcome to this awesome chat!");
    // this.inputElement.click();

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
    addResponseMessage("Welcome to this awesome chat!");
    // this.inputElement.click();
    // Now send the message throught the backend API
  }

  openChat = (e) => {
    this.setState({showChat: !this.state.showChat})
    setTimeout(() => {
      this.inputElement.click();
    }, 1000);
    
  }

  render() {
    let discrepancyList = idx(this.state, _ => _.discrepancyList)
      ? this.state.discrepancyList
      : []
    let disRow = null
    disRow = discrepancyList.map((dis, index) => (
      <tr key={index}>
        <td><Moment format="Do MMMM YYYY">{dis.Scan_Received_Date}</Moment></td>
        <td>{dis.Reported_By}</td>
        <td>{dis.Accession_No}</td>
        <td>Appears to have used in ACC slice 354-{359 + index + 1}</td>
        <td>
          <div className="badge badge-success p-2" onClick={e => this.openChat(e)}>Chat</div>
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
            </div>
          </div>
        </div>
        {this.state.showChat && (<Widget
          handleNewUserMessage={this.handleNewUserMessage}
          title="My new awesome title"
          subtitle="And my cool subtitle"
          showCloseButton= "true"
          launcher={handleToggle => (
            <img onClick={handleToggle}  ref={input => this.inputElement = input} alt="" src={chat} style={{"width":"22%"}} className="rcw-open-launcher" />
          )}
        />)}
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