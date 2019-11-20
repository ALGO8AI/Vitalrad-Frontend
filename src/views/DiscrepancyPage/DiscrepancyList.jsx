// @flow
import React from 'react'
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import chat from '../../img/chat.png'

type Props = {

}

type State = {
  showChat: boolean,
};

export class DiscrepancyList extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)

    this.state = {
      showChat: false,
    }
  }
  componentDidMount() {
    addResponseMessage("Welcome to this awesome chat!");
    // this.inputElement.click();

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
                      <tr>
                        <td> 10 January 2019</td>
                        <td>Dr Vital Reporter 1</td>
                        <td>12345678</td>
                        <td>Appears to have used in ACC slice 345-352</td>
                        <td>
                          <div className="badge badge-success p-2" onClick={e => this.openChat(e)}>Chat</div>
                        </td>
                      </tr>
                      <tr>
                        <td> 11 January 2019</td>
                        <td>Dr Vital Reporter 3</td>
                        <td>25445678</td>
                        <td>Appears to have used in ACC slice 345-352</td>
                        <td>
                          <div className="badge badge-success p-2" onClick={e => this.openChat(e)}>Chat</div>
                        </td>
                      </tr>
                      <tr>
                        <td> 12 January 2019</td>
                        <td>Dr Vital Reporter 3</td>
                        <td>87545678</td>
                        <td>Appears to have used in ACC slice 345-352</td>
                        <td>
                          <div className="badge badge-success p-2" onClick={e => this.openChat(e)}>Chat</div>
                        </td>
                      </tr>
                      <tr>
                        <td> 13 January 2019</td>
                        <td>Dr Vital Reporter 4</td>
                        <td>65245678</td>
                        <td>Appears to have used in ACC slice 345-352</td>
                        <td>
                          <div className="badge badge-success p-2" onClick={e => this.openChat(e)}>Chat</div>
                        </td>
                      </tr>
                      <tr>
                        <td> 14 January 2019</td>
                        <td>Dr Vital Reporter 2</td>
                        <td>45215678</td>
                        <td>Appears to have used in ACC slice 345-352</td>
                        <td>
                          <div className="badge badge-success p-2" onClick={e => this.openChat(e)}>Chat</div>
                        </td>
                      </tr>
                      <tr>
                        <td> 15 January 2019</td>
                        <td>Dr Vital Reporter 5</td>
                        <td>52345678</td>
                        <td>Appears to have used in ACC slice 345-352</td>
                        <td>
                          <div className="badge badge-success p-2" onClick={e => this.openChat(e)}>Chat</div>
                        </td>
                      </tr>
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

