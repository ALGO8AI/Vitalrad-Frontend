// @flow
import React from 'react'
import Asides from '../../components/aside/aside'
import {Table} from 'react-bootstrap'
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import {institution} from 'react-icons-kit/fa/institution'
import Icon from 'react-icons-kit'
import chat from '../../img/chat.png'

type Props = {

}

type State = {
  showChat: boolean,
};

export class UserList extends React.Component<Props, State> {
  
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
      <div>
        <Asides/>
        <div className="aside-right">
          <div className="category-detail">
            <div className="detail-container">
              <h5 className="float-left heading-title">
                Users Listing
              </h5>
              <Table bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr key="0">
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdolauncher</td>
                  <td><Icon onClick={e => this.openChat(e)} icon={institution} /></td>
                </tr>
                <tr key="1">
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                <td><Icon onClick={e => this.openChat(e)} icon={institution} /></td>
                </tr>
              </tbody>
            </Table>
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

