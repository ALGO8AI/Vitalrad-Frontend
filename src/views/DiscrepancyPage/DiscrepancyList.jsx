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
                  <h4 className="card-title mb-sm-0">Products Inventory</h4>
                </div>
                <div className="table-responsive border rounded p-1">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="font-weight-bold">Store ID</th>
                        <th className="font-weight-bold">Amount</th>
                        <th className="font-weight-bold">Gateway</th>
                        <th className="font-weight-bold">Created at</th>
                        <th className="font-weight-bold">Paid at</th>
                        <th className="font-weight-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td> Katie Holmes </td>
                        <td>$3621</td>
                        <td>alipay</td>
                        <td>04 Jun 2019</td>
                        <td>18 Jul 2019</td>
                        <td>
                          <div className="badge badge-success p-2" onClick={e => this.openChat(e)}>Chat</div>
                        </td>
                      </tr>
                      <tr>
                        <td> Minnie Copeland </td>
                        <td>$6245</td>
                        <td>Paypal</td>
                        <td>25 Sep 2019</td>
                        <td>07 Oct 2019</td>
                        <td>
                          <div className="badge badge-success p-2" onClick={e => this.openChat(e)}>Chat</div>
                        </td>
                      </tr>
                      <tr>
                        <td> Rodney Sims </td>
                        <td>$9265</td>
                        <td> alipay</td>
                        <td>12 dec 2019</td>
                        <td>26 Aug 2019</td>
                        <td>
                          <div className="badge badge-success p-2" onClick={e => this.openChat(e)}>Chat</div>
                        </td>
                      </tr>
                      <tr>
                        <td> Carolyn Barker </td>
                        <td>$2263</td>
                        <td> alipay</td>
                        <td>30 Sep 2019</td>
                        <td>20 Oct 2019</td>
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

